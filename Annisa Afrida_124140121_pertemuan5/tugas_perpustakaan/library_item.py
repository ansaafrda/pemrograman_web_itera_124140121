"""
Modul library_item.py
---------------------
Berisi abstract class LibraryItem sebagai dasar semua item perpustakaan,
beserta subclass Book dan Magazine.
"""

from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """
    Abstract class dasar untuk semua item perpustakaan.

    Atribut:
        _item_id (protected): ID unik item.
        _title   (protected): Judul item.
        _year    (protected): Tahun terbit.
        __is_dipinjam (private): Status peminjaman, hanya bisa diubah
                                 lewat method pinjam() dan kembalikan().
    """

    def __init__(self, item_id: str, title: str, year: int):
        self._item_id = item_id
        self._title = title
        self._year = year
        self.__is_dipinjam = False  # private: dilindungi dari akses luar

    # ---------- Property (getter) ----------
    @property
    def item_id(self) -> str:
        """ID item (read-only)."""
        return self._item_id

    @property
    def title(self) -> str:
        """Judul item (read-only)."""
        return self._title

    @property
    def is_dipinjam(self) -> bool:
        """Status peminjaman item (read-only). True jika sedang dipinjam."""
        return self.__is_dipinjam

    # ---------- Method konkret ----------
    def pinjam(self) -> bool:
        """
        Meminjam item.
        Return True jika berhasil, False jika item sudah dipinjam.
        """
        if self.__is_dipinjam:
            return False
        self.__is_dipinjam = True
        return True

    def kembalikan(self) -> bool:
        """
        Mengembalikan item.
        Return True jika berhasil, False jika item memang tidak sedang dipinjam.
        """
        if not self.__is_dipinjam:
            return False
        self.__is_dipinjam = False
        return True

    def status(self) -> str:
        """Mengembalikan teks status ketersediaan item."""
        return "Dipinjam" if self.__is_dipinjam else "Tersedia"

    # ---------- Abstract methods ----------
    @abstractmethod
    def get_detail(self) -> str:
        """Mengembalikan detail lengkap item. Wajib diimplementasikan subclass."""

    @abstractmethod
    def hitung_denda(self, hari_terlambat: int) -> int:
        """Menghitung denda keterlambatan (Rupiah). Wajib diimplementasikan subclass."""

    def __str__(self) -> str:
        return f"[{self._item_id}] {self._title} ({self._year}) - {self.status()}"


class Book(LibraryItem):
    """Subclass LibraryItem untuk buku. Denda Rp1.000 per hari."""

    DENDA_PER_HARI = 1000

    def __init__(self, item_id: str, title: str, year: int,
                 author: str, pages: int):
        super().__init__(item_id, title, year)
        self._author = author
        self._pages = pages

    def get_detail(self) -> str:
        """Detail buku: judul, penulis, tahun, jumlah halaman, status."""
        return (f"BUKU     | ID: {self._item_id} | Judul: {self._title} | "
                f"Penulis: {self._author} | Tahun: {self._year} | "
                f"Halaman: {self._pages} | Status: {self.status()}")

    def hitung_denda(self, hari_terlambat: int) -> int:
        """Denda buku = hari terlambat x Rp1.000."""
        return max(0, hari_terlambat) * self.DENDA_PER_HARI


class Magazine(LibraryItem):
    """Subclass LibraryItem untuk majalah. Denda Rp2.000 per hari."""

    DENDA_PER_HARI = 2000

    def __init__(self, item_id: str, title: str, year: int,
                 issue: int, publisher: str):
        super().__init__(item_id, title, year)
        self._issue = issue
        self._publisher = publisher

    def get_detail(self) -> str:
        """Detail majalah: judul, edisi, penerbit, tahun, status."""
        return (f"MAJALAH  | ID: {self._item_id} | Judul: {self._title} | "
                f"Edisi: {self._issue} | Penerbit: {self._publisher} | "
                f"Tahun: {self._year} | Status: {self.status()}")

    def hitung_denda(self, hari_terlambat: int) -> int:
        """Denda majalah = hari terlambat x Rp2.000."""
        return max(0, hari_terlambat) * self.DENDA_PER_HARI