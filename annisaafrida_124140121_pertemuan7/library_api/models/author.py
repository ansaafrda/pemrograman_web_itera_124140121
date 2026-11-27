from sqlalchemy import Boolean, Column, String, Text
from sqlalchemy.orm import relationship

from .meta import BaseModel


class Author(BaseModel):
    """Model ORM untuk tabel authors (penulis buku)."""

    __tablename__ = 'authors'

    name = Column(String(200), nullable=False)
    bio = Column(Text)
    is_active = Column(Boolean, nullable=False, default=True)

    books = relationship(
        'Book',
        back_populates='author',
        cascade='all, delete-orphan',
    )
