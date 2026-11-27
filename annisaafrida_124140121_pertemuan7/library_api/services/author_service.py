"""Service layer untuk Author: aturan bisnis di luar view."""
from ..models import Author


def list_authors(dbsession):
    """Semua penulis yang masih aktif, urut berdasarkan id."""
    return (
        dbsession.query(Author)
        .filter_by(is_active=True)
        .order_by(Author.id.asc())
        .all()
    )


def get_author(dbsession, author_id):
    """Satu penulis aktif berdasarkan id, atau None bila tidak ada."""
    return (
        dbsession.query(Author)
        .filter_by(id=author_id, is_active=True)
        .first()
    )


def create_author(dbsession, data):
    """Membuat penulis baru."""
    author = Author(name=data['name'], bio=data.get('bio'))
    dbsession.add(author)
    dbsession.flush()
    return author


def update_author(dbsession, author, data):
    """Mengubah field penulis yang dikirim pada data."""
    if 'name' in data:
        author.name = data['name']
    if 'bio' in data:
        author.bio = data['bio']
    dbsession.flush()
    return author


def delete_author(dbsession, author):
    """Soft delete: penulis ditandai tidak aktif, bukan dihapus dari tabel.

    Penulis yang masih punya buku aktif tidak boleh dihapus.
    """
    active_books = [b for b in author.books if b.is_active]
    if active_books:
        raise ValueError(
            'Penulis masih memiliki buku aktif sehingga tidak bisa dihapus'
        )
    author.is_active = False
    dbsession.flush()
    return author
