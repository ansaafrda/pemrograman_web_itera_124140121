"""Skema validasi Marshmallow untuk Book."""
from marshmallow import Schema, fields, validate


class BookSchema(Schema):
    """Skema output Book."""

    id = fields.Int(dump_only=True)
    author_id = fields.Int(required=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, max=300))
    isbn = fields.Str(required=True, validate=validate.Length(min=10, max=20))
    price = fields.Float(required=True, validate=validate.Range(min=0))
    stock = fields.Int(required=True, validate=validate.Range(min=0))
    author_name = fields.Method('get_author_name', dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    def get_author_name(self, obj):
        if obj.author is not None:
            return obj.author.name
        return None


class BookCreateSchema(BookSchema):
    """Skema input saat membuat Book baru."""


class BookUpdateSchema(Schema):
    """Skema input saat mengubah Book (semua field opsional)."""

    author_id = fields.Int()
    title = fields.Str(validate=validate.Length(min=1, max=300))
    isbn = fields.Str(validate=validate.Length(min=10, max=20))
    price = fields.Float(validate=validate.Range(min=0))
    stock = fields.Int(validate=validate.Range(min=0))
