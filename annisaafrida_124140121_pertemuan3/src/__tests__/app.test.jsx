import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useBookStats } from '../hooks/useBookStats'
import { BookForm } from '../components/BookForm/BookForm'
import { BookFilter } from '../components/BookFilter/BookFilter'
import { BookList } from '../components/BookList/BookList'
import App from '../App'

beforeEach(() => window.localStorage.clear())

describe('useLocalStorage', () => {
  it('menyimpan dan membaca nilai dari localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', []))
    act(() => result.current[1](['a']))
    expect(JSON.parse(window.localStorage.getItem('test-key'))).toEqual(['a'])
    const { result: again } = renderHook(() => useLocalStorage('test-key', []))
    expect(again.current[0]).toEqual(['a'])
  })
})

describe('useBookStats', () => {
  it('menghitung total dan sebaran status dengan benar', () => {
    const books = [
      { id: '1', status: 'milik' },
      { id: '2', status: 'milik' },
      { id: '3', status: 'baca' },
      { id: '4', status: 'beli' },
    ]
    const { result } = renderHook(() => useBookStats(books))
    expect(result.current.total).toBe(4)
    expect(result.current.byStatus).toEqual({ milik: 2, baca: 1, beli: 1 })
    expect(result.current.percent(2)).toBe(50)
  })
})

describe('BookForm', () => {
  it('menampilkan pesan error dan tidak memanggil onSubmit saat field kosong', () => {
    const onSubmit = vi.fn()
    render(<BookForm submitLabel="Tambah Buku" onSubmit={onSubmit} />)
    fireEvent.click(screen.getByRole('button', { name: 'Tambah Buku' }))
    expect(screen.getByText('Judul wajib diisi.')).toBeInTheDocument()
    expect(screen.getByText('Penulis wajib diisi.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('memanggil onSubmit dengan data saat form valid', () => {
    const onSubmit = vi.fn()
    render(<BookForm submitLabel="Tambah Buku" onSubmit={onSubmit} />)
    fireEvent.change(screen.getByLabelText('Judul Buku'), { target: { value: 'Dune' } })
    fireEvent.change(screen.getByLabelText('Penulis'), { target: { value: 'Frank Herbert' } })
    fireEvent.click(screen.getByRole('button', { name: 'Tambah Buku' }))
    expect(onSubmit).toHaveBeenCalledWith({ title: 'Dune', author: 'Frank Herbert', status: 'milik' })
  })
})

describe('BookFilter', () => {
  it('meneruskan perubahan status dan pencarian ke parent', () => {
    const onStatusChange = vi.fn()
    const onQueryChange = vi.fn()
    render(<BookFilter status="semua" onStatusChange={onStatusChange} query="" onQueryChange={onQueryChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Sedang Dibaca' }))
    expect(onStatusChange).toHaveBeenCalledWith('baca')
    fireEvent.change(screen.getByLabelText('Cari buku'), { target: { value: 'Bumi' } })
    expect(onQueryChange).toHaveBeenCalledWith('Bumi')
  })
})

describe('BookList', () => {
  it('menampilkan empty state saat daftar kosong dan kartu buku saat ada data', () => {
    const noop = () => {}
    const { rerender } = render(<BookList books={[]} onEdit={noop} onDelete={noop} />)
    expect(screen.getByText(/Belum ada buku yang cocok/)).toBeInTheDocument()
    rerender(<BookList books={[{ id: 'x', title: 'Dune', author: 'Frank Herbert', status: 'baca' }]} onEdit={noop} onDelete={noop} />)
    expect(screen.getByRole('heading', { name: 'Dune' })).toBeInTheDocument()
    expect(screen.getByText('Sedang Dibaca')).toBeInTheDocument()
  })
})

describe('App (integrasi)', () => {
  it('menambah buku lewat form lalu menemukannya lewat pencarian', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Judul Buku'), { target: { value: 'Dune' } })
    fireEvent.change(screen.getByLabelText('Penulis'), { target: { value: 'Frank Herbert' } })
    fireEvent.click(screen.getByRole('button', { name: 'Tambah Buku' }))
    expect(screen.getByRole('heading', { name: 'Dune' })).toBeInTheDocument()
    // Pencarian menyaring: ketik judul yang tidak cocok -> kartu hilang.
    fireEvent.change(screen.getByLabelText('Cari buku'), { target: { value: 'zzzz' } })
    expect(screen.queryByRole('heading', { name: 'Dune' })).not.toBeInTheDocument()
    // Hapus pencarian -> kartu muncul lagi.
    fireEvent.change(screen.getByLabelText('Cari buku'), { target: { value: '' } })
    expect(screen.getByRole('heading', { name: 'Dune' })).toBeInTheDocument()
  })
})
