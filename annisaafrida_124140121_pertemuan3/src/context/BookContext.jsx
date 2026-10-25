import { createContext, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Context API: state buku dibagikan ke seluruh halaman tanpa prop drilling.
const BookContext = createContext(null)

// Data awal agar aplikasi tidak kosong saat pertama dibuka.
const SEED_BOOKS = [
  { id: 'b1', title: 'Tentang Kamu', author: 'Tere Liye', status: 'milik' },
  { id: 'b2', title: 'Sirkus Belakang Rumah', author: 'Andrea Hirata', status: 'baca' },
  { id: 'b3', title: 'Hujan', author: 'Tere Liye', status: 'beli' },
]

export function BookProvider({ children }) {
  const [books, setBooks] = useLocalStorage('pustaka-books', SEED_BOOKS)

  const addBook = (book) =>
    setBooks((prev) => [...prev, { ...book, id: `b${Date.now()}` }])

  const updateBook = (id, changes) =>
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...changes } : b)))

  const deleteBook = (id) => setBooks((prev) => prev.filter((b) => b.id !== id))

  // useMemo: nilai context hanya berubah saat books berubah (hindari re-render sia-sia).
  const value = useMemo(
    () => ({ books, addBook, updateBook, deleteBook }),
    [books],
  )

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// Hook pembaca context: komponen cukup memanggil useBooks().
export function useBooks() {
  const ctx = useContext(BookContext)
  if (!ctx) throw new Error('useBooks harus dipakai di dalam <BookProvider>')
  return ctx
}
