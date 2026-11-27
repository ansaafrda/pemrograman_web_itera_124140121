from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import configure_mappers
from sqlalchemy.pool import StaticPool
import zope.sqlalchemy

# Import model agar ter-register di metadata SQLAlchemy.
from .author import Author  # noqa: F401
from .book import Book  # noqa: F401

# Jalankan configure_mappers setelah seluruh model diimpor.
configure_mappers()


def get_engine(settings, prefix='sqlalchemy.'):
    """Membuat engine; SQLite in-memory memakai satu koneksi bersama."""
    url = settings.get(prefix + 'url', '')
    if url.startswith('sqlite:///:memory:'):
        from sqlalchemy import create_engine
        return create_engine(
            url,
            connect_args={'check_same_thread': False},
            poolclass=StaticPool,
        )
    return engine_from_config(settings, prefix)


def get_session_factory(engine):
    factory = sessionmaker()
    factory.configure(bind=engine)
    return factory


def get_tm_session(session_factory, transaction_manager):
    """Session SQLAlchemy yang terikat otomatis dengan zope.sqlalchemy."""
    dbsession = session_factory()
    zope.sqlalchemy.register(
        dbsession, transaction_manager=transaction_manager)
    return dbsession


def includeme(config):
    """Inisialisasi konfigurasi database saat Pyramid startup."""
    settings = config.get_settings()
    settings['tm.manager_hook'] = 'pyramid_tm.explicit_manager'
    engine = get_engine(settings)
    session_factory = get_session_factory(engine)
    config.registry['db_engine'] = engine
    config.registry['dbsession_factory'] = session_factory

    # Menyediakan request.dbsession di setiap request HTTP.
    config.add_request_method(
        lambda r: get_tm_session(session_factory, r.tm),
        'dbsession',
        reify=True,
    )
