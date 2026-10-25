import PropTypes from 'prop-types'
import './BookFilter.css'

// Filter + pencarian: state diangkat ke parent (Home), komponen ini hanya
// menampilkan kontrol dan meneruskan perubahan lewat callback.
const STATUS_OPTIONS = [
  { value: 'semua', label: 'Semua' },
  { value: 'milik', label: 'Dimiliki' },
  { value: 'baca', label: 'Sedang Dibaca' },
  { value: 'beli', label: 'Ingin Dibeli' },
]

export function BookFilter({ status, onStatusChange, query, onQueryChange }) {
  return (
    <div className="book-filter">
      <input
        type="search" placeholder="Cari judul atau penulis…" aria-label="Cari buku"
        value={query} onChange={(e) => onQueryChange(e.target.value)}
      />
      <div className="filter-buttons" role="group" aria-label="Filter status">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value} type="button"
            className={status === opt.value ? 'chip active' : 'chip'}
            onClick={() => onStatusChange(opt.value)}
            aria-pressed={status === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

BookFilter.propTypes = {
  status: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
}
