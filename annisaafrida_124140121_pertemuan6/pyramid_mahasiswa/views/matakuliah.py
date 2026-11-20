from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPNotFound,
    HTTPBadRequest,
)
from ..models import Matakuliah


def _validasi_sks_semester(nilai, nama_field):
    """Validasi kolom sks/semester: wajib integer dan lebih besar dari nol."""
    if isinstance(nilai, bool) or not isinstance(nilai, int):
        return f'Field {nama_field} harus berupa bilangan bulat!'
    if nilai <= 0:
        return f'Field {nama_field} harus lebih besar dari nol!'
    return None

# 1. READ ALL: Menampilkan daftar seluruh matakuliah
@view_config(route_name='matakuliah_list', renderer='json')
def matakuliah_list(request):
    """View untuk mengambil semua data matakuliah"""
    dbsession = request.dbsession
    matakuliahs = dbsession.query(Matakuliah).order_by(Matakuliah.id.asc()).all()
    return {'matakuliahs': [m.to_dict() for m in matakuliahs]}

# 2. READ ONE: Menampilkan detail satu matakuliah berdasarkan ID
@view_config(route_name='matakuliah_detail', renderer='json')
def matakuliah_detail(request):
    """View untuk melihat detail satu matakuliah berdasarkan ID di URL"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']
    matakuliah = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    if matakuliah is None:
        return HTTPNotFound(json_body={'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'})
    return {'matakuliah': matakuliah.to_dict()}

# 3. CREATE: Menambahkan data matakuliah baru
@view_config(route_name='matakuliah_add', request_method='POST', renderer='json')
def matakuliah_add(request):
    """View untuk menambahkan matakuliah baru dari payload JSON"""
    try:
        json_data = request.json_body

        # Validasi field wajib
        required_fields = ['kode_mk', 'nama_mk', 'sks', 'semester']
        for field in required_fields:
            if field not in json_data or json_data[field] in (None, ''):
                return HTTPBadRequest(json_body={'error': f'Field {field} wajib diisi!'})

        # Validasi sks dan semester: integer dan lebih besar dari nol
        for field in ('sks', 'semester'):
            pesan = _validasi_sks_semester(json_data[field], field)
            if pesan is not None:
                return HTTPBadRequest(json_body={'error': pesan})

        matakuliah = Matakuliah(
            kode_mk=json_data['kode_mk'],
            nama_mk=json_data['nama_mk'],
            sks=json_data['sks'],
            semester=json_data['semester'],
        )

        dbsession = request.dbsession
        dbsession.add(matakuliah)

        # Flush session untuk mengeksekusi query INSERT dan mendapatkan nilai primary key id yang di-generate PostgreSQL
        dbsession.flush()

        return {'success': True, 'matakuliah': matakuliah.to_dict()}
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})

# 4. UPDATE: Mengubah data matakuliah yang sudah ada
@view_config(route_name='matakuliah_update', request_method='PUT', renderer='json')
def matakuliah_update(request):
    """View untuk mengupdate data matakuliah berdasarkan ID"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']
    matakuliah = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    if matakuliah is None:
        return HTTPNotFound(json_body={'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'})

    try:
        json_data = request.json_body

        if 'kode_mk' in json_data:
            matakuliah.kode_mk = json_data['kode_mk']
        if 'nama_mk' in json_data:
            matakuliah.nama_mk = json_data['nama_mk']
        if 'sks' in json_data:
            pesan = _validasi_sks_semester(json_data['sks'], 'sks')
            if pesan is not None:
                return HTTPBadRequest(json_body={'error': pesan})
            matakuliah.sks = json_data['sks']
        if 'semester' in json_data:
            pesan = _validasi_sks_semester(json_data['semester'], 'semester')
            if pesan is not None:
                return HTTPBadRequest(json_body={'error': pesan})
            matakuliah.semester = json_data['semester']

        return {'success': True, 'matakuliah': matakuliah.to_dict()}
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})

# 5. DELETE: Menghapus data matakuliah
@view_config(route_name='matakuliah_delete', request_method='DELETE', renderer='json')
def matakuliah_delete(request):
    """View untuk menghapus matakuliah berdasarkan ID"""
    dbsession = request.dbsession
    matakuliah_id = request.matchdict['id']
    matakuliah = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    if matakuliah is None:
        return HTTPNotFound(json_body={'error': f'Matakuliah dengan ID {matakuliah_id} tidak ditemukan'})

    dbsession.delete(matakuliah)
    return {'success': True, 'message': f'Matakuliah dengan ID {matakuliah_id} berhasil dihapus'}
