import { useMemo, useState } from 'react'
import { useBooks } from '../../context/BookContext'
import { BookForm } from '../../components/BookForm/BookForm'
import { BookFilter } from '../../components/BookFilter/BookFilter'
import { BookList } from '../../components/BookList/BookList'
import './Home.css'

// Halaman utama: form tambah/edit + filter/pencarian + daftar buku.
// Filter & pencarian dihitung dengan useMemo agar tidak dihitung ulang sia-sia.
export function Home() {
  const { books, addBook, updateBook, deleteBook } = useBooks()
  const [status, setStatus] = useState('semua')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)

  const visibleBooks = useMemo(() => {
    const q = query.trim().toLowerCase()
    return books.filter((b) => {
      const matchStatus = status === 'semua' || b.status === status
      const matchQuery = q === '' || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      return matchStatus && matchQuery
    })
  }, [books, status, query])

  const handleSubmit = (data) => {
    if (editing) {
      updateBook(editing.id, data)
      setEditing(null)
    } else {
      addBook(data)
    }
  }

  return (
    <div className="home-wrap">
      <section className="hero">
        <h2>Koleksi Bukuku</h2>
        <p>{books.length} buku dalam koleksimu — tambah, atur, dan temukan bacaan berikutnya.</p>
      </section>
      <div className="home-grid">
      <section className="card">
        <h2>{editing ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>
        <BookForm
          initialBook={editing}
          submitLabel={editing ? 'Simpan Perubahan' : 'Tambah Buku'}
          onSubmit={handleSubmit}
          onCancel={editing ? () => setEditing(null) : undefined}
        />
      </section>
      <section className="card">
        <h2>Daftar Buku <span className="count">({visibleBooks.length} dari {books.length})</span></h2>
        <BookFilter status={status} onStatusChange={setStatus} query={query} onQueryChange={setQuery} />
        <BookList
          books={visibleBooks}
          onEdit={(book) => setEditing(book)}
          onDelete={(id) => {
            if (window.confirm('Hapus buku ini?')) deleteBook(id)
          }}
        />
      </section>
    </div>
    </div>
  )
}
