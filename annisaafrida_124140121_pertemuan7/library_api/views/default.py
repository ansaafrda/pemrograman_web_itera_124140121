from pyramid.view import view_config


@view_config(route_name='home', renderer='json')
def home(request):
    """Halaman utama API: info singkat proyek dan daftar endpoint."""
    return {
        'project': 'library_api',
        'description': 'LibraryAPI: REST API perpustakaan, Author dan Book (Praktikum PAW Pertemuan 7)',
        'endpoints': [
            'GET /api/v1/authors',
            'GET /api/v1/authors/{id}',
            'POST /api/v1/authors',
            'PUT /api/v1/authors/{id}',
            'DELETE /api/v1/authors/{id}',
            'GET /api/v1/books',
            'GET /api/v1/books/{id}',
            'POST /api/v1/books',
            'PUT /api/v1/books/{id}',
            'DELETE /api/v1/books/{id}',
        ],
    }


@view_config(route_name='cors_preflight', renderer='json')
def cors_preflight(request):
    """Menjawab preflight OPTIONS dari browser (CORS)."""
    request.response.status = 204
    return {}
