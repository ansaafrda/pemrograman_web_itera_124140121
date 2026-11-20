# Manajemen Matakuliah — REST API (Pyramid Framework)

**Nama:** Annisa Afrida
**NIM:** 124140121
**Kelas:** RA
**Mata Kuliah:** Pengembangan Aplikasi Web — Praktikum Pertemuan 6 (Pyramid Framework)

## Deskripsi Aplikasi

Aplikasi RESTful API untuk pengelolaan data Mahasiswa dan Matakuliah,
dibangun dengan Pyramid Framework, SQLAlchemy ORM, migrasi Alembic, dan
PostgreSQL. Aplikasi mengimplementasikan arsitektur berlapis: model data
ORM, migrasi skema database, routing URL Dispatch, dan view controller
CRUD dengan penanganan status code HTTP yang tepat (200, 400, 404).

Data seeding awal (2 mahasiswa dan 3 matakuliah) adalah data contoh
untuk demonstrasi.

## Endpoint API

| Method | Endpoint | Deskripsi |
| --- | --- | --- |
| GET | `/api/mahasiswa` | Menampilkan seluruh daftar mahasiswa |
| GET | `/api/mahasiswa/{id}` | Menampilkan detail mahasiswa berdasarkan ID (404 jika tidak ditemukan) |
| POST | `/api/mahasiswa` | Menambahkan mahasiswa baru (field wajib: `nim`, `nama`, `jurusan`; 400 jika tidak lengkap) |
| PUT | `/api/mahasiswa/{id}` | Memperbarui data mahasiswa |
| DELETE | `/api/mahasiswa/{id}` | Menghapus mahasiswa berdasarkan ID |
| GET | `/api/matakuliah` | Menampilkan seluruh daftar matakuliah |
| GET | `/api/matakuliah/{id}` | Menampilkan detail matakuliah berdasarkan ID (404 jika tidak ditemukan) |
| POST | `/api/matakuliah` | Menambahkan matakuliah baru (field wajib: `kode_mk`, `nama_mk`, `sks`, `semester`; 400 jika tidak lengkap) |
| PUT | `/api/matakuliah/{id}` | Memperbarui data matakuliah |
| DELETE | `/api/matakuliah/{id}` | Menghapus matakuliah berdasarkan ID |

Model Matakuliah: tabel `matakuliah` dengan kolom `id` (Integer, Primary
Key, Autoincrement), `kode_mk` (Text, Unique, Not Null), `nama_mk`
(Text, Not Null), `sks` (Integer, Not Null), `semester` (Integer,
Not Null), serta method `to_dict()` untuk serialisasi JSON. Kolom `sks`
dan `semester` divalidasi sebagai integer dan harus lebih besar dari
nol.

## Struktur Folder

```text
annisaafrida_124140121_pertemuan6/
├── development.ini
├── production.ini
├── setup.py
├── README.md
├── .gitignore
└── pyramid_mahasiswa/
    ├── __init__.py
    ├── routes.py
    ├── alembic/
    │   ├── env.py
    │   └── versions/
    │       ├── 20261112_create_mahasiswa_table.py
    │       └── 20261112_create_matakuliah_table.py
    ├── models/
    │   ├── __init__.py
    │   ├── meta.py
    │   ├── mahasiswa.py
    │   └── matakuliah.py
    ├── scripts/
    │   ├── __init__.py
    │   └── initialize_db.py
    ├── static/
    │   └── .gitkeep
    └── views/
        ├── __init__.py
        ├── default.py
        ├── mahasiswa.py
        └── matakuliah.py
```

Folder `static/` hanya berisi `.gitkeep` agar folder ikut terlacak Git;
aplikasi ini murni JSON API sehingga tidak ada file statis lain.

## Instalasi Lingkungan

```bash
# 1. Buat dan aktifkan virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Pasang proyek dalam mode development (editable install)
pip install -e ".[testing]"
```

Catatan: Pyramid 2.0.2 masih mengimpor `pkg_resources`, yang sudah
dihapus dari setuptools 82 ke atas. Karena itu lingkungan ini memakai
`setuptools==81.0.0`. Jika instalasi gagal dengan galat
`No module named 'pkg_resources'`, jalankan
`pip install 'setuptools==81.0.0'` di dalam virtual environment.

## Konfigurasi Database PostgreSQL

```bash
# 1. Buat database dan user di PostgreSQL
psql -U postgres
CREATE DATABASE pyramid_mahasiswa;
CREATE USER pyramid_user WITH ENCRYPTED PASSWORD 'pyramid_pass';
GRANT ALL PRIVILEGES ON DATABASE pyramid_mahasiswa TO pyramid_user;

# 2. Koneksi database diatur di development.ini
sqlalchemy.url = postgresql://pyramid_user:pyramid_pass@localhost:5432/pyramid_mahasiswa
```

## Migrasi Database dan Seeding Data Awal

```bash
# 1. Buat file migrasi (sudah tersedia di pyramid_mahasiswa/alembic/versions/)
alembic -c development.ini revision --autogenerate -m "create mahasiswa table"
alembic -c development.ini revision --autogenerate -m "create matakuliah table"

# 2. Terapkan migrasi ke database
alembic -c development.ini upgrade head

# 3. Isi data awal (2 mahasiswa dan 3 matakuliah contoh)
python -m pyramid_mahasiswa.scripts.initialize_db development.ini
```

## Menjalankan Server

```bash
pserve development.ini --reload
```

Server berjalan di `http://localhost:6543`.

## Pengujian API

Pengujian dilakukan dengan cURL untuk seluruh endpoint Mahasiswa dan
Matakuliah (GET daftar, GET detail, POST, POST dengan field tidak
lengkap, PUT, DELETE, dan GET ID yang sudah dihapus).

```bash
# Contoh: daftar seluruh matakuliah
curl -X GET http://localhost:6543/api/matakuliah

# Contoh: tambah matakuliah baru
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk": "IF2110", "nama_mk": "Pemrograman Web", "sks": 3, "semester": 5}'
```

## Screenshot Pengujian

![Pengujian endpoint Mahasiswa](screenshot-curl-mahasiswa.png)

![Pengujian endpoint Matakuliah](screenshot-curl-matakuliah.png)
