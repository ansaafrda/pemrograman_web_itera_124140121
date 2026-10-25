import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { BookProvider } from './context/BookContext'
import { Home } from './pages/Home/Home'
import { Stats } from './pages/Stats/Stats'

// App: Provider Context membungkus Router agar state buku tersedia
// di semua halaman; Router menyediakan navigasi multi-halaman.
export default function App() {
  return (
    <BookProvider>
      <BrowserRouter>
        <header className="site-header">
          <div className="header-inner">
            <h1 className="brand">MyBooks</h1>
            <nav className="site-nav">
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Beranda</NavLink>
              <NavLink to="/stats" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Statistik</NavLink>
            </nav>
          </div>
        </header>
        <main className="page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="*" element={<p className="card">Halaman tidak ditemukan. <a href="/">Kembali ke Beranda</a></p>} />
          </Routes>
        </main>
        <footer className="site-footer">
          <p>Tugas Praktikum Pertemuan 3 — Pengembangan Aplikasi Web</p>
          <p>Annisa Afrida · 124140121 · Kelas RA</p>
        </footer>
      </BrowserRouter>
    </BookProvider>
  )
}
