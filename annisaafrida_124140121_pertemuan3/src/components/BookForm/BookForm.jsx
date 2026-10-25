import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './BookForm.css'

// Form controlled component: setiap input dikendalikan state React.
// Validasi: judul & penulis wajib isi; pesan error tampil di bawah field.
const EMPTY = { title: '', author: '', status: 'milik' }

export function BookForm({ initialBook, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  // Saat mode edit dibuka, isi form dengan data buku yang diedit.
  useEffect(() => {
    setForm(initialBook ? { title: initialBook.title, author: initialBook.author, status: initialBook.status } : EMPTY)
    setErrors({})
  }, [initialBook])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Hapus pesan error field begitu pengguna mulai mengetik.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Judul wajib diisi.'
    if (!form.author.trim()) nextErrors.author = 'Penulis wajib diisi.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return // batal kirim bila ada error
    onSubmit({ title: form.title.trim(), author: form.author.trim(), status: form.status })
    if (!initialBook) setForm(EMPTY)
  }

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="book-title">Judul Buku</label>
        <input
          id="book-title" name="title" type="text" placeholder="cth: Bumi Manusia"
          value={form.title} onChange={handleChange}
          aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'err-title' : undefined}
        />
        {errors.title && <p className="error" id="err-title" role="alert">{errors.title}</p>}
      </div>
      <div className="field">
        <label htmlFor="book-author">Penulis</label>
        <input
          id="book-author" name="author" type="text" placeholder="cth: Pramoedya Ananta Toer"
          value={form.author} onChange={handleChange}
          aria-invalid={Boolean(errors.author)} aria-describedby={errors.author ? 'err-author' : undefined}
        />
        {errors.author && <p className="error" id="err-author" role="alert">{errors.author}</p>}
      </div>
      <div className="field">
        <label htmlFor="book-status">Status</label>
        <select id="book-status" name="status" value={form.status} onChange={handleChange}>
          <option value="milik">Dimiliki</option>
          <option value="baca">Sedang Dibaca</option>
          <option value="beli">Ingin Dibeli</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
        {onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>Batal</button>}
      </div>
    </form>
  )
}

BookForm.propTypes = {
  initialBook: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }),
  submitLabel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
}
