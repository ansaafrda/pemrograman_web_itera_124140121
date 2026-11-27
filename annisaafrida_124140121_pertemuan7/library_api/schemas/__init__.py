"""Paket skema validasi Marshmallow."""
from .author_schema import (
    AuthorCreateSchema,
    AuthorSchema,
    AuthorUpdateSchema,
)
from .book_schema import (
    BookCreateSchema,
    BookSchema,
    BookUpdateSchema,
)

__all__ = [
    'AuthorCreateSchema',
    'AuthorSchema',
    'AuthorUpdateSchema',
    'BookCreateSchema',
    'BookSchema',
    'BookUpdateSchema',
]
