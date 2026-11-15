"""
Modul library.py
----------------
Berisi class Library yang mengelola koleksi item perpustakaan.
"""

from library_item import LibraryItem


class Library:
    """
    Mengelola koleksi LibraryItem (Book, Magazine, dsb).

    Atribut:
        __koleksi (private): dict {item_id: LibraryItem}. Tidak bisa diakses
                             langsung dari luar class.
    """

    def __init__(self, name: str):
        self.name = name
        self.__koleksi = {}

    def tambah_item(self, item: LibraryItem) -> bool:
        """
        Menambahkan item ke koleksi.
        Return False jika ID sudah terdaftar atau objek bukan LibraryItem.
        """
        if not isinstance(item, LibraryItem):
            print("Gagal: objek bukan LibraryItem.")
            return False
        if item.item_id in self.__koleksi:
            print(f"Gagal: ID '{item.item_id}' sudah terdaftar.")
            return False
        self.__koleksi[item.item_id] = item
        print(f"Berhasil menambahkan: {item.title}")
        return True

    def tampilkan_katalog(self, hanya_tersedia: bool = True) -> None:
        """
        Menampilkan katalog. Jika hanya_tersedia=True, hanya item yang
        belum dipinjam yang ditampilkan.
        Polymorphism: get_detail() dipanggil pada tiap item, hasilnya
        berbeda sesuai tipe (Book/Magazine).
        """
        judul = "TERSEDIA" if hanya_tersedia else "LENGKAP"
        print(f"\n=== Katalog {judul} - {self.name} ===")
        ditampilkan = 0
        for item in self.__koleksi.values():
            if hanya_tersedia and item.is_dipinjam:
                continue
            print(item.get_detail())
            ditampilkan += 1
        if ditampilkan == 0:
            print("(tidak ada item)")

    def cari_by_id(self, item_id: str):
        """Mencari item berdasarkan ID. Return item atau None."""
        return self.__koleksi.get(item_id)

    def cari_by_judul(self, kata_kunci: str) -> list:
        """Mencari item yang judulnya memuat kata kunci (tidak case-sensitive)."""
        kata_kunci = kata_kunci.lower()
        return [item for item in self.__koleksi.values()
                if kata_kunci in item.title.lower()]

    def pinjam_item(self, item_id: str) -> bool:
        """Meminjam item berdasarkan ID."""
        item = self.cari_by_id(item_id)
        if item is None:
            print(f"Item dengan ID '{item_id}' tidak ditemukan.")
            return False
        if item.pinjam():
            print(f"Berhasil meminjam: {item.title}")
            return True
        print(f"'{item.title}' sedang dipinjam.")
        return False

    def kembalikan_item(self, item_id: str) -> bool:
        """Mengembalikan item berdasarkan ID."""
        item = self.cari_by_id(item_id)
        if item is None:
            print(f"Item dengan ID '{item_id}' tidak ditemukan.")
            return False
        if item.kembalikan():
            print(f"Berhasil mengembalikan: {item.title}")
            return True
        print(f"'{item.title}' tidak sedang dipinjam.")
        return False