from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    Numeric,
    String,
)
from sqlalchemy.orm import relationship

from .meta import BaseModel


class Book(BaseModel):
    """Model ORM untuk tabel books (buku)."""

    __tablename__ = 'books'

    author_id = Column(Integer, ForeignKey('authors.id'), nullable=False)
    title = Column(String(300), nullable=False)
    isbn = Column(String(20), unique=True, nullable=False)
    price = Column(Numeric(10, 2), nullable=False, default=0)
    stock = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)

    author = relationship('Author', back_populates='books')
