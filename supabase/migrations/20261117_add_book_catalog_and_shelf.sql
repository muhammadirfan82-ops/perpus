-- SIPERPUS: tambah metadata katalog dan lokasi rak pada tabel buku.
-- Jalankan sekali di Supabase SQL Editor.
ALTER TABLE public.books
  ADD COLUMN IF NOT EXISTS katalog text,
  ADD COLUMN IF NOT EXISTS nomor_rak text;

CREATE INDEX IF NOT EXISTS books_katalog_idx ON public.books (katalog);
CREATE INDEX IF NOT EXISTS books_nomor_rak_idx ON public.books (nomor_rak);
