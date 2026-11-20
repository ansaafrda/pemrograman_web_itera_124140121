"""Aplikasi RESTful API Manajemen Mahasiswa dan Matakuliah.

Praktikum PAW Pertemuan 6 — Pyramid Framework.
Nama: Annisa Afrida | NIM: 124140121 | Kelas: RA
"""

from pyramid.config import Configurator


def main(global_config, **settings):
    """Return a Pyramid WSGI application."""
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.include('.models')
    config.include('.routes')
    config.scan()
    return config.make_wsgi_app()
