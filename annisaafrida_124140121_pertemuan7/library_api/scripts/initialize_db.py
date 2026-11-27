import argparse
import sys

from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError

from .. import models


def setup_models(dbsession):
    """Mengisi data contoh awal (seeding) penulis dan buku.

    Idempoten: bila tabel authors sudah berisi data, seeding dilewati.
    """
    if dbsession.query(models.Author).count() > 0:
        print('Data contoh sudah ada, seeding dilewati.')
        return

    author1 = models.Author(
        name='Andrea Hirata',
        bio='Penulis Indonesia, dikenal lewat novel Laskar Pelangi.',
    )
    author2 = models.Author(
        name='Tere Liye',
        bio='Penulis Indonesia dengan banyak novel populer.',
    )
    dbsession.add(author1)
    dbsession.add(author2)
    dbsession.flush()

    dbsession.add(models.Book(
        author_id=author1.id,
        title='Laskar Pelangi',
        isbn='9789793062792',
        price=89000,
        stock=12,
    ))
    dbsession.add(models.Book(
        author_id=author1.id,
        title='Sang Pemimpi',
        isbn='9789791227401',
        price=75000,
        stock=8,
    ))
    dbsession.add(models.Book(
        author_id=author2.id,
        title='Bumi',
        isbn='9786020329375',
        price=69000,
        stock=15,
    ))


def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'config_uri',
        help='Configuration file, e.g., development.ini',
    )
    return parser.parse_args(argv[1:])


def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    env = bootstrap(args.config_uri)
    try:
        with env['request'].tm:
            dbsession = env['request'].dbsession
            setup_models(dbsession)
            print('Berhasil memasukkan data contoh awal penulis dan buku!')
    except OperationalError:
        print('LibraryAPI gagal terhubung ke database SQL.')
        print('Pastikan service PostgreSQL berjalan dan isi .env sudah benar.')


if __name__ == '__main__':
    main()
