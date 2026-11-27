import { useCallback, useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:6544/api/v1'

const emptyBook = {
  author_id: '',
  title: '',
  isbn: '',
  price: '',
  stock: '',
}

function formatPrice(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function App() {
  const [books, setBooks] = useState([])
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyBook)
  const [editingId, setEditingId] = useState(null)
  const [authorForm, setAuthorForm] = useState({ name: '', bio: '' })
  const [message, setMessage] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [booksRes, authorsRes] = await Promise.all([
        fetch(`${API_URL}/books`),
        fetch(`${API_URL}/authors`),
      ])
      if (!booksRes.ok || !authorsRes.ok) {
        throw new Error('Gagal memuat data dari server.')
      }
      const booksJson = await booksRes.json()
      const authorsJson = await authorsRes.json()
      setBooks(booksJson.books || [])
      setAuthors(authorsJson.authors || [])
    } catch (err) {
      setError('Tidak bisa terhubung ke server API. Pastikan pserve berjalan di port 6544.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function startEdit(book) {
    setEditingId(book.id)
    setForm({
      author_id: String(book.author_id),
      title: book.title,
      isbn: book.isbn,
      price: String(book.price),
      stock: String(book.stock),
    })
    setMessage('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyBook)
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    const payload = {
      author_id: Number(form.author_id),
      title: form.title.trim(),
      isbn: form.isbn.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    }
    const url = editingId ? `${API_URL}/books/${editingId}` : `${API_URL}/books`
    const method = editingId ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Gagal menyimpan buku.')
        return
      }
      setMessage(editingId ? 'Buku berhasil diubah.' : 'Buku berhasil ditambah.')
      cancelEdit()
      loadData()
    } catch {
      setMessage('Tidak bisa terhubung ke server API.')
    }
  }

  async function handleDelete(book) {
    if (!window.confirm(`Hapus buku "${book.title}"?`)) {
      return
    }
    try {
      const res = await fetch(`${API_URL}/books/${book.id}`, { method: 'DELETE' })
      if (!res.ok) {
        setMessage('Gagal menghapus buku.')
        return
      }
      setMessage('Buku berhasil dihapus.')
      loadData()
    } catch {
      setMessage('Tidak bisa terhubung ke server API.')
    }
  }

  async function handleAuthorSubmit(event) {
    event.preventDefault()
    setMessage('')
    try {
      const res = await fetch(`${API_URL}/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authorForm.name.trim(),
          bio: authorForm.bio.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Gagal menyimpan penulis.')
        return
      }
      setMessage('Penulis berhasil ditambah.')
      setAuthorForm({ name: '', bio: '' })
      loadData()
    } catch {
      setMessage('Tidak bisa terhubung ke server API.')
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>LibraryAPI</h1>
        <p>Katalog buku dan penulis perpustakaan</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-info">{message}</div>}

      <main>
        <section className="card">
          <h2>{editingId ? 'Ubah Buku' : 'Tambah Buku'}</h2>
          <form onSubmit={handleSubmit} className="form">
            <label>
              Penulis
              <select
                name="author_id"
                value={form.author_id}
                onChange={handleChange}
                required
              >
                <option value="">Pilih penulis</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Judul
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={300}
                placeholder="Judul buku"
              />
            </label>
            <label>
              ISBN
              <input
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                required
                minLength={10}
                maxLength={20}
                placeholder="Contoh: 9789793062792"
              />
            </label>
            <label>
              Harga (Rp)
              <input
                name="price"
                type="number"
                min="0"
                step="1000"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="89000"
              />
            </label>
            <label>
              Stok
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                required
                placeholder="12"
              />
            </label>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Simpan Perubahan' : 'Tambah Buku'}
              </button>
              {editingId && (
                <button type="button" className="btn" onClick={cancelEdit}>
                  Batal
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <h2>Daftar Buku ({books.length})</h2>
          {loading ? (
            <p>Memuat data...</p>
          ) : books.length === 0 ? (
            <p>Belum ada buku. Tambahkan buku lewat formulir di atas.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Penulis</th>
                  <th>ISBN</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author_name}</td>
                    <td>{book.isbn}</td>
                    <td>{formatPrice(book.price)}</td>
                    <td>{book.stock}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-small"
                        onClick={() => startEdit(book)}
                      >
                        Ubah
                      </button>{' '}
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => handleDelete(book)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="card">
          <h2>Penulis ({authors.length})</h2>
          <form onSubmit={handleAuthorSubmit} className="form form-inline">
            <label>
              Nama penulis
              <input
                value={authorForm.name}
                onChange={(event) =>
                  setAuthorForm((prev) => ({ ...prev, name: event.target.value }))
                }
                required
                maxLength={200}
                placeholder="Nama penulis"
              />
            </label>
            <label>
              Bio singkat
              <input
                value={authorForm.bio}
                onChange={(event) =>
                  setAuthorForm((prev) => ({ ...prev, bio: event.target.value }))
                }
                placeholder="Bio singkat (opsional)"
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Tambah Penulis
            </button>
          </form>
          <ul className="author-list">
            {authors.map((author) => (
              <li key={author.id}>
                <strong>{author.name}</strong>
                {author.bio && <span> — {author.bio}</span>}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>
          Data contoh ditampilkan untuk keperluan latihan. LibraryAPI berjalan di{' '}
          <code>http://localhost:6544</code>.
        </p>
      </footer>
    </div>
  )
}
