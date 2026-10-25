import { Link } from 'react-router-dom'
import { useBooks } from '../../context/BookContext'
import { useBookStats } from '../../hooks/useBookStats'
import './Stats.css'

// Halaman statistik: memakai custom hook useBookStats untuk menghitung
// total dan sebaran status, ditampilkan dalam tabel + kartu ringkasan.
const STATUS_LABEL = { milik: 'Dimiliki', baca: 'Sedang Dibaca', beli: 'Ingin Dibeli' }

export function Stats() {
  const { books } = useBooks()
  const { total, byStatus, percent } = useBookStats(books)

  return (
    <section className="card stats-page">
      <h2>Statistik Koleksi</h2>
      <div className="stat-cards">
        <div className="stat-card"><strong>{total}</strong><span>Total Buku</span></div>
        {Object.entries(byStatus).map(([key, value]) => (
          <div className="stat-card" key={key}>
            <strong>{value}</strong>
            <span>{STATUS_LABEL[key]} ({percent(value)}%)</span>
          </div>
        ))}
      </div>
      <table className="stats-table">
        <caption>Sebaran buku berdasarkan status</caption>
        <thead><tr><th>Status</th><th>Jumlah</th><th>Persentase</th></tr></thead>
        <tbody>
          {Object.entries(byStatus).map(([key, value]) => (
            <tr key={key}>
              <td>{STATUS_LABEL[key]}</td>
              <td>{value}</td>
              <td>{percent(value)}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr><th>Total</th><th>{total}</th><th>100%</th></tr></tfoot>
      </table>
      <p><Link to="/" className="btn btn-primary">Kembali ke Daftar Buku</Link></p>
    </section>
  )
}
