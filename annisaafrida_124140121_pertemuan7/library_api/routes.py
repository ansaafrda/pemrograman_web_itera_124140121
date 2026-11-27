"""Peta URL (routing REST API) LibraryAPI."""


def includeme(config):
    """Mendaftarkan seluruh rute aplikasi ke konfigurasi Pyramid."""
    config.add_static_view('static', 'static', cache_max_age=3600)

    # Halaman utama API
    config.add_route('home', '/')

    # Preflight CORS untuk semua rute API
    config.add_route('cors_preflight', '/api/v1/{rest:.*}', request_method='OPTIONS')

    # REST API Authors
    config.add_route('author_list', '/api/v1/authors', request_method='GET')
    config.add_route('author_detail', '/api/v1/authors/{id}', request_method='GET')
    config.add_route('author_add', '/api/v1/authors', request_method='POST')
    config.add_route('author_update', '/api/v1/authors/{id}', request_method='PUT')
    config.add_route('author_delete', '/api/v1/authors/{id}', request_method='DELETE')

    # REST API Books
    config.add_route('book_list', '/api/v1/books', request_method='GET')
    config.add_route('book_detail', '/api/v1/books/{id}', request_method='GET')
    config.add_route('book_add', '/api/v1/books', request_method='POST')
    config.add_route('book_update', '/api/v1/books/{id}', request_method='PUT')
    config.add_route('book_delete', '/api/v1/books/{id}', request_method='DELETE')
