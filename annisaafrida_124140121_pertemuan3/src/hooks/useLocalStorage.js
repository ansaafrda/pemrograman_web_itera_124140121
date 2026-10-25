import { useState, useEffect } from 'react'

/**
 * Custom hook: state yang tersimpan otomatis di localStorage.
 * - Membaca nilai awal dari localStorage (lazy initializer, sekali saja).
 * - Setiap nilai berubah, nilai baru ditulis kembali ke localStorage.
 * - Jika data tersimpan rusak, kembali ke nilai awal agar aplikasi tidak crash.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Penyimpanan penuh / tidak tersedia: aplikasi tetap berjalan di memori.
    }
  }, [key, value])

  return [value, setValue]
}
