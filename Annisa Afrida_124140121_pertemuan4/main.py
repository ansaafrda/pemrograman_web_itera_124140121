"""Program utama untuk menguji modul math_operations."""

import math_operations
from math_operations import (
    luas_lingkaran,
    keliling_lingkaran,
    celsius_ke_fahrenheit,
    celsius_ke_kelvin,
)


def garis(judul):
    """Mencetak judul bagian dengan pemisah.

    Parameter:
        judul (str): teks judul.
    """
    print("\n" + "=" * 45)
    print(judul)
    print("=" * 45)


def main():
    print(f"Konstanta PI dari modul: {math_operations.PI}")

    # Cara impor 1: import math_operations (akses lewat nama modul)
    garis("PERSEGI")
    for sisi in (4, 7.5):
        luas = math_operations.luas_persegi(sisi)
        keliling = math_operations.keliling_persegi(sisi)
        print(
            f"Sisi {sisi:>5} -> Luas: {luas:>8.2f} "
            f"| Keliling: {keliling:>8.2f}"
        )

    garis("PERSEGI PANJANG")
    for p, l in ((5, 3), (10, 6.5)):
        luas = math_operations.luas_persegi_panjang(p, l)
        keliling = math_operations.keliling_persegi_panjang(p, l)
        print(
            f"{p:>4} x {l:<4} -> Luas: {luas:>8.2f} "
            f"| Keliling: {keliling:>8.2f}"
        )

    # Cara impor 2: from math_operations import ... (langsung nama fungsi)
    garis("LINGKARAN")
    for r in (7, 10.5):
        print(
            f"Jari-jari {r:>5} -> Luas: {luas_lingkaran(r):>8.2f} "
            f"| Keliling: {keliling_lingkaran(r):>8.2f}"
        )

    garis("KONVERSI SUHU")
    print(f"{'Celsius':>8} | {'Fahrenheit':>10} | {'Kelvin':>8}")
    for c in (0, 25, 37, 100):
        print(
            f"{c:>8} | {celsius_ke_fahrenheit(c):>10.2f} "
            f"| {celsius_ke_kelvin(c):>8.2f}"
        )


if __name__ == "__main__":
    main()