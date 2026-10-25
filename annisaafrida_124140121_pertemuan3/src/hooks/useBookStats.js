/**
 * Custom hook: statistik turunan dari daftar buku.
 * Tidak menyimpan state sendiri, hanya menghitung dari props books.
 */
export function useBookStats(books) {
  const total = books.length
  const byStatus = {
    milik: books.filter((b) => b.status === 'milik').length,
    baca: books.filter((b) => b.status === 'baca').length,
    beli: books.filter((b) => b.status === 'beli').length,
  }
  const percent = (n) => (total === 0 ? 0 : Math.round((n / total) * 100))
  return { total, byStatus, percent }
}
