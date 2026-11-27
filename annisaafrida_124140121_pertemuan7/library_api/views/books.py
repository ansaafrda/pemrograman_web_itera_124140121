"""View CRUD untuk Book."""

from marshmallow import ValidationError
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from pyramid.view import view_config

from ..schemas import BookCreateSchema, BookSchema, BookUpdateSchema
from ..services import book_service

book_schema = BookSchema()
book_list_schema = BookSchema(many=True)
book_create_schema = BookCreateSchema()
book_update_schema = BookUpdateSchema()


@view_config(route_name='book_list', renderer='json')
def book_list(request):
    """READ ALL: daftar semua buku aktif."""
    books = book_service.list_books(request.dbsession)
    return {'books': book_list_schema.dump(books)}


@view_config(route_name='book_detail', renderer='json')
def book_detail(request):
    """READ DETAIL: satu buku berdasarkan id."""
    book = book_service.get_book(request.dbsession, request.matchdict['id'])
    if book is None:
        return HTTPNotFound(
            json_body={'error': f"Buku dengan id {request.matchdict['id']} tidak ditemukan"}
        )
    return {'book': book_schema.dump(book)}


@view_config(route_name='book_add', request_method='POST', renderer='json')
def book_add(request):
    """CREATE: menambah buku baru."""
    try:
        data = book_create_schema.load(request.json_body)
    except ValidationError as err:
        return HTTPBadRequest(
            json_body={'error': 'Validasi gagal', 'messages': err.messages}
        )
    try:
        book = book_service.create_book(request.dbsession, data)
    except ValueError as err:
        return HTTPBadRequest(json_body={'error': str(err)})
    request.response.status = 201
    return {'success': True, 'book': book_schema.dump(book)}


@view_config(route_name='book_update', request_method='PUT', renderer='json')
def book_update(request):
    """UPDATE: mengubah buku berdasarkan id."""
    book = book_service.get_book(request.dbsession, request.matchdict['id'])
    if book is None:
        return HTTPNotFound(
            json_body={'error': f"Buku dengan id {request.matchdict['id']} tidak ditemukan"}
        )
    try:
        data = book_update_schema.load(request.json_body)
    except ValidationError as err:
        return HTTPBadRequest(
            json_body={'error': 'Validasi gagal', 'messages': err.messages}
        )
    try:
        book = book_service.update_book(request.dbsession, book, data)
    except ValueError as err:
        return HTTPBadRequest(json_body={'error': str(err)})
    return {'success': True, 'book': book_schema.dump(book)}


@view_config(route_name='book_delete', request_method='DELETE', renderer='json')
def book_delete(request):
    """DELETE: soft delete buku berdasarkan id."""
    book = book_service.get_book(request.dbsession, request.matchdict['id'])
    if book is None:
        return HTTPNotFound(
            json_body={'error': f"Buku dengan id {request.matchdict['id']} tidak ditemukan"}
        )
    book_service.delete_book(request.dbsession, book)
    return {
        'success': True,
        'message': f"Buku dengan id {request.matchdict['id']} berhasil dihapus",
    }
