/* SIPERPUS catalog navigation and rack-label integration.
 * Include this file once in index.html, after the application markup:
 * <script src="catalog-integration.js" defer></script>
 */
(() => {
  'use strict';

  const CATALOG_URL = new URL('katalog.html', document.currentScript?.src || window.location.href).href;
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch]);

  function addCatalogMenuLink() {
    const nav = document.getElementById('sidebar-nav');
    if (!nav || nav.querySelector('[data-catalog-integration]')) return;

    const link = document.createElement('a');
    link.href = CATALOG_URL;
    link.target = '_blank';
    link.rel = 'noopener';
    link.dataset.catalogIntegration = 'true';
    link.className = 'sidebar-link group flex items-center px-3 py-3 text-sm font-medium rounded-md text-blue-100';
    link.innerHTML = '<i class="fas fa-book-open text-lg mr-3 w-6 text-center text-blue-300 group-hover:text-white"></i> Katalog & Lokasi Rak';
    nav.appendChild(link);
  }

  function openRackLabel(book) {
    const popup = window.open('', '_blank', 'noopener,noreferrer,width=600,height=420');
    if (!popup) {
      window.alert('Izinkan pop-up untuk mencetak label rak.');
      return;
    }
    const title = escapeHtml(book.title || 'Judul tidak tersedia');
    const barcode = escapeHtml(book.barcode || '-');
    const rack = escapeHtml(book.rack || 'Belum ditentukan');
    const catalog = escapeHtml(book.catalog || '-');
    popup.document.open();
    popup.document.write(`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Label Rak - ${title}</title><style>body{font-family:Arial,sans-serif;margin:0;padding:24px}.label{border:2px solid #111;max-width:520px;margin:12vh auto;padding:32px;text-align:center}.rack{font-size:30px;font-weight:bold;margin:12px 0}.title{font-size:22px;font-weight:bold}.meta{color:#444}@media print{body{padding:0}.label{margin:0 auto;width:90%;margin-top:20mm}}</style></head><body><main class="label"><div>LOKASI KOLEKSI PERPUSTAKAAN</div><div class="rack">RAK ${rack}</div><div class="title">${title}</div><p class="meta">Katalog: ${catalog}</p><p class="meta">Barcode: ${barcode}</p></main><script>window.onload=()=>window.print()<\/script></body></html>`);
    popup.document.close();
  }

  function enhanceBookTable() {
    const table = document.getElementById('books-table');
    if (!table) return;
    const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim().toLocaleLowerCase('id'));
    const columnIndex = (terms, fallback) => {
      const idx = headers.findIndex(text => terms.some(term => text.includes(term)));
      return idx >= 0 ? idx : fallback;
    };
    const titleIndex = columnIndex(['judul'], 1);
    const barcodeIndex = columnIndex(['barcode'], 0);
    const catalogIndex = columnIndex(['katalog'], -1);
    const rackIndex = columnIndex(['nomor rak', 'rak'], -1);
    const actionIndex = columnIndex(['aksi'], headers.length - 1);

    table.querySelectorAll('tbody tr').forEach(row => {
      const cells = [...row.cells];
      if (cells.length < 2 || row.querySelector('[data-rack-label]')) return;
      const actionCell = cells[actionIndex] || cells[cells.length - 1];
      if (!actionCell) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.rackLabel = 'true';
      button.title = 'Lihat / cetak label rak';
      button.setAttribute('aria-label', 'Lihat atau cetak label rak');
      button.className = 'inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-200';
      button.innerHTML = '<i class="fas fa-location-dot"></i><span>Lihat Rak</span>';
      button.addEventListener('click', () => openRackLabel({
        title: cells[titleIndex]?.textContent.trim(),
        barcode: cells[barcodeIndex]?.textContent.trim(),
        catalog: catalogIndex >= 0 ? cells[catalogIndex]?.textContent.trim() : '',
        rack: rackIndex >= 0 ? cells[rackIndex]?.textContent.trim() : ''
      }));
      actionCell.append(' ', button);
    });
  }

  function enhance() {
    addCatalogMenuLink();
    enhanceBookTable();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance);
  else enhance();

  // Main application replaces sidebar and table markup during navigation.
  const observer = new MutationObserver(enhance);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
