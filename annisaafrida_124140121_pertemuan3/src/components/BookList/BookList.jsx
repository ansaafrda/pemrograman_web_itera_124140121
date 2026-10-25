import PropTypes from 'prop-types'
import './BookList.css'

// Satu kartu buku: menampilkan data + aksi edit/hapus (diaktifkan dari parent).
export function BookCard({ book, onEdit, onDelete }) {
  const statusLabel = { milik: 'Dimiliki', baca: 'Sedang Dibaca', beli: 'Ingin Dibeli' }[book.status]
  return (
    <article className="book-card">
      <div>
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        <span className={`badge badge-${book.status}`}>{statusLabel}</span>
      </div>
      <div className="card-actions">
        <button type="button" className="btn btn-small" onClick={() => onEdit(book)}>Edit</button>
        <button type="button" className="btn btn-small btn-danger" onClick={() => onDelete(book.id)}>Hapus</button>
      </div>
    </article>
  )
}

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

// Daftar buku: rendering list dengan key stabil (id), plus empty state.
export function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return <p className="empty">Belum ada buku yang cocok. Tambahkan buku baru atau ubah filter/pencarian.</p>
  }
  return (
    <ul className="book-list">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard book={book} onEdit={onEdit} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  )
}

BookList.propTypes = {
  books: PropTypes.arrayOf(BookCard.propTypes.book).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}
