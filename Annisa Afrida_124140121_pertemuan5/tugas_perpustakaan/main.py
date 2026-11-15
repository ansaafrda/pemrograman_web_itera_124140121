"""
main.py
-------
Skrip pengujian Sistem Manajemen Perpustakaan Sederhana.
Jalankan dengan: python main.py
"""

from library_item import Book, Magazine
from library import Library


def main():
    perpus = Library("Perpustakaan Kampus")

    # 1. Menambahkan item
    print("--- 1. Menambahkan item ---")
    perpus.tambah_item(Book("B001", "Pemrograman Python", 2021, "Budi Santoso", 320))
    perpus.tambah_item(Book("B002", "Struktur Data", 2019, "Siti Aminah", 412))
    perpus.tambah_item(Magazine("M001", "Tech Today", 2024, 15, "Media Teknologi"))
    perpus.tambah_item(Magazine("M002", "Sains Populer", 2023, 8, "Pustaka Ilmu"))
    perpus.tambah_item(Book("B001", "Duplikat", 2020, "Anonim", 100))  # ID ganda

    # 2. Menampilkan katalog
    print("\n--- 2. Menampilkan katalog ---")
    perpus.tampilkan_katalog()

    # 3. Mencari item
    print("\n--- 3. Mencari item ---")
    hasil_id = perpus.cari_by_id("M001")
    print("Cari ID 'M001'  :", hasil_id)
    hasil_judul = perpus.cari_by_judul("python")
    print("Cari judul 'python':", [str(i) for i in hasil_judul])
    print("Cari ID 'X999'  :", perpus.cari_by_id("X999"))

    # 4. Status ketersediaan
    print("\n--- 4. Status ketersediaan ---")
    perpus.pinjam_item("B001")
    perpus.pinjam_item("B001")  # sudah dipinjam
    print("is_dipinjam B001:", perpus.cari_by_id("B001").is_dipinjam)
    perpus.tampilkan_katalog()                       # B001 tidak muncul
    perpus.tampilkan_katalog(hanya_tersedia=False)   # semua muncul
    perpus.kembalikan_item("B001")
    perpus.tampilkan_katalog()

    # 5. Polymorphism: hitung_denda berbeda tiap tipe
    print("\n--- 5. Polymorphism hitung_denda (terlambat 3 hari) ---")
    for kode in ("B002", "M002"):
        item = perpus.cari_by_id(kode)
        print(f"{item.title}: Rp{item.hitung_denda(3):,}")


if __name__ == "__main__":
    main()