"""Skema validasi Marshmallow untuk Author."""
from marshmallow import Schema, fields, validate


class AuthorSchema(Schema):
    """Skema output Author."""

    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    bio = fields.Str(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class AuthorCreateSchema(AuthorSchema):
    """Skema input saat membuat Author baru."""


class AuthorUpdateSchema(Schema):
    """Skema input saat mengubah Author (semua field opsional)."""

    name = fields.Str(validate=validate.Length(min=1, max=200))
    bio = fields.Str(allow_none=True)
