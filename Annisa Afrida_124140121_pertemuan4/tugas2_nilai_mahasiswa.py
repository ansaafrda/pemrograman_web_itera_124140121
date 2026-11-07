"""Tugas 2: Program Pengelolaan Data Nilai Mahasiswa."""

BOBOT_UTS = 0.30
BOBOT_UAS = 0.40
BOBOT_TUGAS = 0.30

data_mahasiswa = [
    {"nama": "Andi Pratama", "nim": "2401001",
     "nilai_uts": 85, "nilai_uas": 90, "nilai_tugas": 88},
    {"nama": "Budi Santoso", "nim": "2401002",
     "nilai_uts": 70, "nilai_uas": 75, "nilai_tugas": 80},
    {"nama": "Citra Lestari", "nim": "2401003",
     "nilai_uts": 60, "nilai_uas": 65, "nilai_tugas": 70},
    {"nama": "Dewi Anggraini", "nim": "2401004",
     "nilai_uts": 55, "nilai_uas": 50, "nilai_tugas": 60},
    {"nama": "Eko Wijaya", "nim": "2401005",
     "nilai_uts": 40, "nilai_uas": 45, "nilai_tugas": 50},
    {"nama": "Fitri Handayani", "nim": "2401006",
     "nilai_uts": 78, "nilai_uas": 82, "nilai_tugas": 85},
]


def hitung_nilai_akhir(uts, uas, tugas):
    """Menghitung nilai akhir berbobot.

    Parameter:
        uts (float): nilai UTS.
        uas (float): nilai UAS.
        tugas (float): nilai tugas.

    Mengembalikan:
        float: (30% * UTS) + (40% * UAS) + (30% * Tugas).
    """
    return BOBOT_UTS * uts + BOBOT_UAS * uas + BOBOT_TUGAS * tugas


def tentukan_grade(nilai):
    """Menentukan grade huruf dari nilai akhir.

    Parameter:
        nilai (float): nilai akhir.

    Mengembalikan:
        str: grade A, B, C, D, atau E.
    """
    if nilai >= 80:
        return "A"
    elif nilai >= 70:
        return "B"
    elif nilai >= 60:
        return "C"
    elif nilai >= 50:
        return "D"
    else:
        return "E"


def proses_data(daftar):
    """Menambahkan kunci nilai_akhir dan grade ke setiap mahasiswa.

    Parameter:
        daftar (list): list dictionary data mahasiswa.
    """
    for mhs in daftar:
        mhs["nilai_akhir"] = hitung_nilai_akhir(
            mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"]
        )
        mhs["grade"] = tentukan_grade(mhs["nilai_akhir"])


def cetak_tabel(daftar):
    """Mencetak data mahasiswa dalam format tabel.

    Parameter:
        daftar (list): list dictionary data mahasiswa yang sudah diproses.
    """
    garis = "-" * 62
    print(garis)
    print(f"{'No':<4}{'Nama':<22}{'NIM':<12}{'Nilai Akhir':>12}{'Grade':>8}")
    print(garis)
    for i, mhs in enumerate(daftar, start=1):
        print(
            f"{i:<4}{mhs['nama']:<22}{mhs['nim']:<12}"
            f"{mhs['nilai_akhir']:>12.2f}{mhs['grade']:>8}"
        )
    print(garis)


def cetak_info(judul, mhs):
    """Mencetak informasi singkat seorang mahasiswa.

    Parameter:
        judul (str): judul informasi.
        mhs (dict): data mahasiswa.
    """
    print(f"{judul}")
    print(f"  Nama        : {mhs['nama']}")
    print(f"  NIM         : {mhs['nim']}")
    print(f"  Nilai Akhir : {mhs['nilai_akhir']:.2f}")
    print(f"  Grade       : {mhs['grade']}")


def main():
    proses_data(data_mahasiswa)

    print("DATA NILAI MAHASISWA")
    cetak_tabel(data_mahasiswa)

    tertinggi = max(data_mahasiswa, key=lambda m: m["nilai_akhir"])
    terendah = min(data_mahasiswa, key=lambda m: m["nilai_akhir"])

    print()
    cetak_info("Mahasiswa dengan nilai akhir TERTINGGI:", tertinggi)
    print()
    cetak_info("Mahasiswa dengan nilai akhir TERENDAH:", terendah)


if __name__ == "__main__":
    main()