# Integrasi katalog SIPERPUS

Halaman `katalog.html` menyediakan pencarian, filter katalog/nomor rak, ekspor CSV, dan cetak label.

Untuk menambahkan tautan katalog di sidebar aplikasi utama serta tombol **Lihat Rak** pada tabel Data Koleksi, tambahkan satu baris berikut di `index.html` tepat sebelum `</body>`:

```html
<script src="catalog-integration.js" defer></script>
```

Skrip menambahkan tautan katalog di sidebar dan tombol label rak pada setiap baris buku. Tombol membuka label yang bisa dicetak atau disimpan sebagai PDF dari dialog cetak browser. Jika tabel buku belum memiliki kolom katalog atau nomor rak, label menampilkan tanda `-` atau `Belum ditentukan`; lengkapi kolom tersebut pada form buku di aplikasi.

Pastikan migrasi `supabase/migrations/20261117_add_book_catalog_and_shelf.sql` sudah dijalankan di Supabase SQL Editor.
