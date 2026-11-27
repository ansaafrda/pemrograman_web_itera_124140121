"""Unit test endpoint LibraryAPI memakai WebTest dan SQLite in-memory."""
import os

import pytest
from pyramid.paster import get_app
from webtest import TestApp

from library_api.models.meta import Base

HERE = os.path.dirname(os.path.abspath(__file__))
TESTING_INI = os.path.join(HERE, '..', '..', 'testing.ini')


@pytest.fixture(scope='module')
def testapp():
    """Aplikasi Pyramid dengan tabel dibuat di SQLite in-memory."""
    app = get_app(TESTING_INI, 'main')
    engine = app.registry['db_engine']
    Base.metadata.create_all(engine)
    return TestApp(app)


@pytest.fixture(scope='module')
def author_id(testapp):
    """Satu penulis contoh yang dipakai seluruh test buku."""
    res = testapp.post_json(
        '/api/v1/authors',
        {'name': 'Penulis Uji', 'bio': 'Penulis untuk keperluan pengujian.'},
        status=201,
    )
    return res.json['author']['id']


def test_get_authors_empty_list(testapp):
    res = testapp.get('/api/v1/authors', status=200)
    assert 'authors' in res.json


def test_create_author(testapp):
    res = testapp.post_json(
        '/api/v1/authors',
        {'name': 'Penulis Baru', 'bio': 'Bio penulis baru.'},
        status=201,
    )
    assert res.json['author']['name'] == 'Penulis Baru'
    assert res.json['success'] is True


def test_create_author_validation_error(testapp):
    res = testapp.post_json('/api/v1/authors', {'bio': 'Tanpa nama.'}, status=400)
    assert res.json['error'] == 'Validasi gagal'


def test_get_author_not_found(testapp):
    res = testapp.get('/api/v1/authors/99999', status=404)
    assert 'tidak ditemukan' in res.json['error']


def test_get_books_empty_list(testapp):
    res = testapp.get('/api/v1/books', status=200)
    assert res.json['books'] == []


def test_create_book(testapp, author_id):
    res = testapp.post_json(
        '/api/v1/books',
        {
            'author_id': author_id,
            'title': 'Buku Uji',
            'isbn': '9781234567890',
            'price': 50000,
            'stock': 5,
        },
        status=201,
    )
    assert res.json['book']['title'] == 'Buku Uji'
    assert res.json['book']['author_name'] == 'Penulis Uji'
    assert res.json['success'] is True


def test_create_book_duplicate_isbn(testapp, author_id):
    res = testapp.post_json(
        '/api/v1/books',
        {
            'author_id': author_id,
            'title': 'Buku Duplikat',
            'isbn': '9781234567890',
            'price': 60000,
            'stock': 3,
        },
        status=400,
    )
    assert 'sudah terdaftar' in res.json['error']


def test_create_book_validation_error(testapp, author_id):
    res = testapp.post_json(
        '/api/v1/books',
        {'author_id': author_id, 'title': 'Tanpa ISBN', 'price': 10000, 'stock': 1},
        status=400,
    )
    assert res.json['error'] == 'Validasi gagal'


def test_get_book_detail(testapp, author_id):
    created = testapp.post_json(
        '/api/v1/books',
        {
            'author_id': author_id,
            'title': 'Buku Detail',
            'isbn': '9781234567891',
            'price': 45000,
            'stock': 2,
        },
        status=201,
    )
    book_id = created.json['book']['id']
    res = testapp.get(f'/api/v1/books/{book_id}', status=200)
    assert res.json['book']['title'] == 'Buku Detail'


def test_get_book_not_found(testapp):
    res = testapp.get('/api/v1/books/99999', status=404)
    assert 'tidak ditemukan' in res.json['error']


def test_update_book(testapp, author_id):
    created = testapp.post_json(
        '/api/v1/books',
        {
            'author_id': author_id,
            'title': 'Buku Lama',
            'isbn': '9781234567892',
            'price': 30000,
            'stock': 4,
        },
        status=201,
    )
    book_id = created.json['book']['id']
    res = testapp.put_json(
        f'/api/v1/books/{book_id}',
        {'title': 'Buku Baru', 'stock': 10},
        status=200,
    )
    assert res.json['book']['title'] == 'Buku Baru'
    assert res.json['book']['stock'] == 10


def test_delete_book(testapp, author_id):
    created = testapp.post_json(
        '/api/v1/books',
        {
            'author_id': author_id,
            'title': 'Buku Hapus',
            'isbn': '9781234567893',
            'price': 20000,
            'stock': 1,
        },
        status=201,
    )
    book_id = created.json['book']['id']
    res = testapp.delete(f'/api/v1/books/{book_id}', status=200)
    assert res.json['success'] is True
    testapp.get(f'/api/v1/books/{book_id}', status=404)
