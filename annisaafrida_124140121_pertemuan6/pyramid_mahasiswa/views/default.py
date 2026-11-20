from pyramid.view import view_config


@view_config(route_name='home', renderer='json')
def home(request):
    """Halaman utama API: info singkat proyek dan daftar endpoint."""
    return {
        'project': 'pyramid_mahasiswa',
        'description': 'RESTful API Manajemen Mahasiswa dan Matakuliah (Praktikum PAW Pertemuan 6)',
        'endpoints': [
            'GET /api/mahasiswa',
            'GET /api/mahasiswa/{id}',
            'POST /api/mahasiswa',
            'PUT /api/mahasiswa/{id}',
            'DELETE /api/mahasiswa/{id}',
            'GET /api/matakuliah',
            'GET /api/matakuliah/{id}',
            'POST /api/matakuliah',
            'PUT /api/matakuliah/{id}',
            'DELETE /api/matakuliah/{id}',
        ],
    }
