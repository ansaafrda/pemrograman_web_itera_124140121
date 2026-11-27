"""Konfigurasi database dari file .env."""

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / '.env')


def get_database_url():
    """Menyusun URL database PostgreSQL dari variabel lingkungan."""
    user = os.environ.get('DB_USER', 'postgres')
    password = os.environ.get('DB_PASSWORD', 'postgres')
    host = os.environ.get('DB_HOST', 'localhost')
    port = os.environ.get('DB_PORT', '5432')
    name = os.environ.get('DB_NAME', 'library_api_db')
    return f'postgresql+psycopg2://{user}:{password}@{host}:{port}/{name}'
