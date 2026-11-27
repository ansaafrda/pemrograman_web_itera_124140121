"""Service layer untuk Book: aturan bisnis di luar view."""
from ..models import Author, Book


def list_books(dbsession):
    """Semua buku yang masih aktif, urut berdasarkan id."""
    return (
        dbsession.query(Book)
        .filter_by(is_active=True)
        .order_by(Book.id.asc())
        .all()
    )


def get_book(dbsession, book_id):
    """Satu buku aktif berdasarkan id, atau None bila tidak ada."""
    return (
        dbsession.query(Book)
        .filter_by(id=book_id, is_active=True)
        .first()
    )


def _check_isbn_unique(dbsession, isbn, exclude_id=None):
    """ISBN tidak boleh dipakai dua buku yang berbeda.

    Dicek ke semua buku, termasuk yang sudah di-soft-delete, karena
    constraint unik di database tetap berlaku untuk baris tersebut.
    """
    query = dbsession.query(Book).filter_by(isbn=isbn)
    if exclude_id is not None:
        query = query.filter(Book.id != exclude_id)
    if query.first() is not None:
        raise ValueError(f'ISBN {isbn} sudah terdaftar pada buku lain')


def _check_author_exists(dbsession, author_id):
    """Penulis tujuan harus ada dan masih aktif."""
    author = (
        dbsession.query(Author)
        .filter_by(id=author_id, is_active=True)
        .first()
    )
    if author is None:
        raise ValueError(f'Penulis dengan id {author_id} tidak ditemukan')
    return author


def create_book(dbsession, data):
    """Membuat buku baru setelah cek penulis dan keunikan ISBN."""
    _check_author_exists(dbsession, data['author_id'])
    _check_isbn_unique(dbsession, data['isbn'])
    book = Book(
        author_id=data['author_id'],
        title=data['title'],
        isbn=data['isbn'],
        price=data['price'],
        stock=data['stock'],
    )
    dbsession.add(book)
    dbsession.flush()
    return book


def update_book(dbsession, book, data):
    """Mengubah field buku yang dikirim pada data."""
    if 'author_id' in data:
        _check_author_exists(dbsession, data['author_id'])
        book.author_id = data['author_id']
    if 'isbn' in data:
        _check_isbn_unique(dbsession, data['isbn'], exclude_id=book.id)
        book.isbn = data['isbn']
    if 'title' in data:
        book.title = data['title']
    if 'price' in data:
        book.price = data['price']
    if 'stock' in data:
        book.stock = data['stock']
    dbsession.flush()
    return book


def delete_book(dbsession, book):
    """Soft delete: buku ditandai tidak aktif, bukan dihapus dari tabel."""
    book.is_active = False
    dbsession.flush()
    return book
