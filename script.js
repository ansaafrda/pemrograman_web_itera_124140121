const STORAGE_KEY = "miniPosKeranjang";
const MIN_NAMA = 3;
const MIN_HARGA = 500;
const MIN_QTY = 1;
const MIN_BELANJA_DISKON = 50000;
const PERSEN_DISKON = 0.10;
const KODE_PROMO = "HEMAT10";

let keranjang = muatKeranjang();

const formBarang = document.getElementById("form-barang");
const inputNama = document.getElementById("nama");
const inputHarga = document.getElementById("harga");
const inputQty = document.getElementById("qty");
const inputKupon = document.getElementById("kupon");
const inputBayar = document.getElementById("bayar");

const elIsiKeranjang = document.getElementById("isi-keranjang");
const elTotalBelanja = document.getElementById("total-belanja");
const elNominalDiskon = document.getElementById("nominal-diskon");
const elTotalAkhir = document.getElementById("total-akhir");
const elKembalian = document.getElementById("kembalian");
const elInfoDiskon = document.getElementById("info-diskon");
const elInfoBayar = document.getElementById("info-bayar");
const btnReset = document.getElementById("btn-reset");
const elTanggal = document.getElementById("tanggal-struk");

function formatRupiah(angka) {
  return "Rp " + Math.round(angka).toLocaleString("id-ID");
}

function tampilkanTanggal() {
  elTanggal.textContent = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function tampilkanError(input, pesan) {
  document.getElementById("error-" + input.id).textContent = pesan;
  input.classList.add("invalid");
}
function bersihkanError(input) {
  document.getElementById("error-" + input.id).textContent = "";
  input.classList.remove("invalid");
}

function validasiNama() {
  const nama = inputNama.value.trim();
  if (nama === "") {
    tampilkanError(inputNama, "Nama barang wajib diisi.");
    return false;
  }
  if (nama.length < MIN_NAMA) {
    tampilkanError(inputNama, `Nama barang minimal ${MIN_NAMA} karakter.`);
    return false;
  }
  bersihkanError(inputNama);
  return true;
}

function validasiHarga() {
  const teks = inputHarga.value.trim();
  const harga = Number(teks);
  if (teks === "" || !Number.isFinite(harga)) {
    tampilkanError(inputHarga, "Harga wajib diisi dengan angka.");
    return false;
  }
  if (harga <= 0) {
    tampilkanError(inputHarga, "Harga harus berupa angka positif.");
    return false;
  }
  if (harga < MIN_HARGA) {
    tampilkanError(inputHarga, `Harga minimal ${formatRupiah(MIN_HARGA)}.`);
    return false;
  }
  bersihkanError(inputHarga);
  return true;
}

function validasiQty() {
  const teks = inputQty.value.trim();
  const qty = Number(teks);
  if (teks === "" || !Number.isFinite(qty)) {
    tampilkanError(inputQty, "Jumlah wajib diisi dengan angka.");
    return false;
  }
  if (!Number.isInteger(qty)) {
    tampilkanError(inputQty, "Jumlah harus berupa bilangan bulat.");
    return false;
  }
  if (qty < MIN_QTY) {
    tampilkanError(inputQty, `Jumlah minimal ${MIN_QTY}.`);
    return false;
  }
  bersihkanError(inputQty);
  return true;
}

function validasiForm() {
  const hasil = [validasiNama(), validasiHarga(), validasiQty()];
  return hasil.every(Boolean);
}

function hitungSubtotal(item) {
  return item.harga * item.qty;
}

function hitungTotalBelanja() {
  return keranjang.reduce((total, item) => total + hitungSubtotal(item), 0);
}

function kuponValid() {
  return inputKupon.value.trim().toUpperCase() === KODE_PROMO;
}

function hitungDiskon(totalBelanja) {
  if (totalBelanja <= 0) {
    return { nominal: 0, alasan: "" };
  }

  if (totalBelanja < MIN_BELANJA_DISKON) {
    return {
      nominal: 0,
      alasan: `Belanja minimal ${formatRupiah(MIN_BELANJA_DISKON)} untuk mendapatkan diskon 10%.`,
    };
  }

  return {
    nominal: totalBelanja * PERSEN_DISKON,
    alasan: kuponValid()
      ? `Kode promo ${KODE_PROMO} berhasil digunakan: diskon 10%.`
      : `Diskon 10% otomatis karena belanja mencapai ${formatRupiah(MIN_BELANJA_DISKON)}.`,
  };
}

function hitungKembalian(uangBayar, totalAkhir) {
  return uangBayar - totalAkhir;
}

function simpanKeranjang() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keranjang));
}

function muatKeranjang() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(data)) return [];
    return data.filter(
      (i) => i && typeof i.nama === "string" && Number(i.harga) > 0 && Number(i.qty) > 0
    );
  } catch (e) {
    return [];
  }
}

function tambahBarang(nama, harga, qty) {
  const sama = keranjang.find(
    (i) => i.nama.toLowerCase() === nama.toLowerCase() && i.harga === harga
  );
  if (sama) {
    sama.qty += qty;
  } else {
    keranjang.push({ nama, harga, qty });
  }
  simpanKeranjang();
}

function hapusBarang(index) {
  keranjang.splice(index, 1);
  simpanKeranjang();
  render();
}

function resetTransaksi() {
  if (keranjang.length > 0 && !confirm("Mulai transaksi baru? Seluruh isi struk akan dikosongkan.")) {
    return;
  }
  keranjang = [];
  localStorage.removeItem(STORAGE_KEY);
  inputKupon.value = "";
  inputBayar.value = "";
  render();
}

function buatSel(teks, kelas) {
  const td = document.createElement("td");
  td.textContent = teks;
  if (kelas) td.className = kelas;
  return td;
}

function renderTabel() {
  elIsiKeranjang.innerHTML = "";

  if (keranjang.length === 0) {
    const tr = document.createElement("tr");
    const td = buatSel("Struk masih kosong. Tambahkan barang lewat form.", "empty");
    td.colSpan = 6;
    tr.appendChild(td);
    elIsiKeranjang.appendChild(tr);
    return;
  }

  keranjang.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.appendChild(buatSel(index + 1));
    tr.appendChild(buatSel(item.nama));
    tr.appendChild(buatSel(formatRupiah(item.harga), "num"));
    tr.appendChild(buatSel(item.qty, "num"));
    tr.appendChild(buatSel(formatRupiah(hitungSubtotal(item)), "num"));

    const tdAksi = document.createElement("td");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-danger btn-small";
    btn.textContent = "Hapus";
    btn.addEventListener("click", () => hapusBarang(index));
    tdAksi.appendChild(btn);
    tr.appendChild(tdAksi);

    elIsiKeranjang.appendChild(tr);
  });
}

function renderRingkasan() {
  const totalBelanja = hitungTotalBelanja();
  const diskon = hitungDiskon(totalBelanja);
  const totalAkhir = totalBelanja - diskon.nominal;

  elTotalBelanja.textContent = formatRupiah(totalBelanja);
  elNominalDiskon.textContent = "- " + formatRupiah(diskon.nominal);
  elTotalAkhir.textContent = formatRupiah(totalAkhir);

  elInfoDiskon.className = "hint";
  if (diskon.alasan) {
    elInfoDiskon.textContent = diskon.alasan;
    elInfoDiskon.classList.add("ok");
  } else if (inputKupon.value.trim() !== "" && !kuponValid()) {
    elInfoDiskon.textContent = "Kode promo tidak valid.";
    elInfoDiskon.classList.add("bad");
  } else {
    elInfoDiskon.textContent = "";
  }

  renderPembayaran(totalAkhir);
}

function renderPembayaran(totalAkhir) {
  elInfoBayar.className = "payment-info";

  if (keranjang.length === 0) {
    elKembalian.textContent = formatRupiah(0);
    elInfoBayar.textContent = "";
    return;
  }

  const teks = inputBayar.value.trim();
  if (teks === "") {
    elKembalian.textContent = formatRupiah(0);
    elInfoBayar.textContent = "Masukkan nominal uang bayar.";
    return;
  }

  const selisih = hitungKembalian(Number(teks), totalAkhir);
  if (selisih < 0) {
    elKembalian.textContent = formatRupiah(0);
    elInfoBayar.textContent = `Uang belum mencukupi, kurang ${formatRupiah(-selisih)}.`;
    elInfoBayar.classList.add("bad");
  } else {
    elKembalian.textContent = formatRupiah(selisih);
    elInfoBayar.textContent = selisih === 0 ? "Uang pas." : "Pembayaran mencukupi.";
    elInfoBayar.classList.add("ok");
  }
}

function render() {
  renderTabel();
  renderRingkasan();
}

formBarang.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validasiForm()) return;

  tambahBarang(inputNama.value.trim(), Number(inputHarga.value), Number(inputQty.value));
  formBarang.reset();
  [inputNama, inputHarga, inputQty].forEach(bersihkanError);
  inputNama.focus();
  render();
});

[[inputNama, validasiNama], [inputHarga, validasiHarga], [inputQty, validasiQty]].forEach(
  ([input, validator]) => {
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid")) validator();
    });
  }
);

inputKupon.addEventListener("input", renderRingkasan);
inputBayar.addEventListener("input", renderRingkasan);

btnReset.addEventListener("click", resetTransaksi);

tampilkanTanggal();
render();
