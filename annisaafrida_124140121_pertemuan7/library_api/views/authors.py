"""View CRUD untuk Author."""

from marshmallow import ValidationError
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from pyramid.view import view_config

from ..schemas import AuthorCreateSchema, AuthorSchema, AuthorUpdateSchema
from ..services import author_service

author_schema = AuthorSchema()
author_list_schema = AuthorSchema(many=True)
author_create_schema = AuthorCreateSchema()
author_update_schema = AuthorUpdateSchema()


@view_config(route_name='author_list', renderer='json')
def author_list(request):
    """READ ALL: daftar semua penulis aktif."""
    authors = author_service.list_authors(request.dbsession)
    return {'authors': author_list_schema.dump(authors)}


@view_config(route_name='author_detail', renderer='json')
def author_detail(request):
    """READ DETAIL: satu penulis berdasarkan id."""
    author = author_service.get_author(request.dbsession, request.matchdict['id'])
    if author is None:
        return HTTPNotFound(
            json_body={'error': f"Penulis dengan id {request.matchdict['id']} tidak ditemukan"}
        )
    return {'author': author_schema.dump(author)}


@view_config(route_name='author_add', request_method='POST', renderer='json')
def author_add(request):
    """CREATE: menambah penulis baru."""
    try:
        data = author_create_schema.load(request.json_body)
    except ValidationError as err:
        return HTTPBadRequest(
            json_body={'error': 'Validasi gagal', 'messages': err.messages}
        )
    author = author_service.create_author(request.dbsession, data)
    request.response.status = 201
    return {'success': True, 'author': author_schema.dump(author)}


@view_config(route_name='author_update', request_method='PUT', renderer='json')
def author_update(request):
    """UPDATE: mengubah penulis berdasarkan id."""
    author = author_service.get_author(request.dbsession, request.matchdict['id'])
    if author is None:
        return HTTPNotFound(
            json_body={'error': f"Penulis dengan id {request.matchdict['id']} tidak ditemukan"}
        )
    try:
        data = author_update_schema.load(request.json_body)
    except ValidationError as err:
        return HTTPBadRequest(
            json_body={'error': 'Validasi gagal', 'messages': err.messages}
        )
    author = author_service.update_author(request.dbsession, author, data)
    return {'success': True, 'author': author_schema.dump(author)}


@view_config(route_name='author_delete', request_method='DELETE', renderer='json')
def author_delete(request):
    """DELETE: soft delete penulis berdasarkan id."""
    author = author_service.get_author(request.dbsession, request.matchdict['id'])
    if author is None:
        return HTTPNotFound(
            json_body={'error': f"Penulis dengan id {request.matchdict['id']} tidak ditemukan"}
        )
    try:
        author_service.delete_author(request.dbsession, author)
    except ValueError as err:
        return HTTPBadRequest(json_body={'error': str(err)})
    return {
        'success': True,
        'message': f"Penulis dengan id {request.matchdict['id']} berhasil dihapus",
    }
