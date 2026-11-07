"""Tugas 1: Program Penghitung BMI (Body Mass Index) sederhana."""


def hitung_bmi(berat, tinggi):
    """Menghitung nilai BMI.

    Parameter:
        berat (float): berat badan dalam kilogram.
        tinggi (float): tinggi badan dalam meter.

    Mengembalikan:
        float: nilai BMI = berat / (tinggi * tinggi).
    """
    return berat / (tinggi * tinggi)


def tentukan_kategori(bmi):
    """Menentukan kategori BMI.

    Parameter:
        bmi (float): nilai BMI.

    Mengembalikan:
        str: kategori status berat badan.
    """
    if bmi < 18.5:
        return "Berat badan kurang"
    elif bmi < 25:
        return "Berat badan normal"
    elif bmi < 30:
        return "Berat badan berlebih"
    else:
        return "Obesitas"


def main():
    print("=== Program Penghitung BMI ===")
    berat = float(input("Masukkan berat badan (kg): "))
    tinggi = float(input("Masukkan tinggi badan (m): "))

    if berat <= 0 or tinggi <= 0:
        print("Berat dan tinggi badan harus lebih besar dari 0.")
        return

    bmi = hitung_bmi(berat, tinggi)
    kategori = tentukan_kategori(bmi)

    print(f"Nilai BMI Anda : {bmi:.2f}")
    print(f"Kategori       : {kategori}")


if __name__ == "__main__":
    main()