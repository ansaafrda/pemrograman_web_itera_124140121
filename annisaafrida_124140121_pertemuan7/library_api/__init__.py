"""LibraryAPI: REST API perpustakaan, Author dan Book.

Praktikum PAW Pertemuan 7.
Nama: Annisa Afrida | NIM: 124140121 | Kelas: RA
"""

from pyramid.config import Configurator


def _cors_headers(event):
    """Menambahkan header CORS pada setiap respons."""
    event.response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })


def main(global_config, **settings):
    """Return a Pyramid WSGI application."""
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.include('.models')
    config.include('.routes')
    config.add_subscriber(_cors_headers, 'pyramid.events.NewResponse')
    config.scan()
    return config.make_wsgi_app()
