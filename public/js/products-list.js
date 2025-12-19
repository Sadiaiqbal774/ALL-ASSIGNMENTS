// public/js/products-list.js
(async function(){
  const container = document.getElementById('products-container');
  const pagination = document.getElementById('products-pagination');
  const category = document.getElementById('filter-category');
  const minPrice = document.getElementById('filter-min');
  const maxPrice = document.getElementById('filter-max');
  const search = document.getElementById('filter-search');

  let state = { page: 1, limit: 6 };

  function buildQuery() {
    const q = new URLSearchParams();
    q.set('page', state.page);
    q.set('limit', state.limit);
    if (category && category.value) q.set('category', category.value);
    if (minPrice && minPrice.value) q.set('minPrice', minPrice.value);
    if (maxPrice && maxPrice.value) q.set('maxPrice', maxPrice.value);
    if (search && search.value) q.set('search', search.value.trim());
    return q.toString();
  }

  async function load() {
    if (!container) return;
    container.innerHTML = 'Loading…';
    try {
      const res = await fetch('/api/products/list?' + buildQuery());
      const data = await res.json();
      renderProducts(data.products);
      renderPagination(data.page, data.totalPages);
    } catch (err) {
      container.innerHTML = '<div class="text-danger">Failed to load products</div>';
      console.error(err);
    }
  }

  function renderProducts(products) {
    if (!products || products.length === 0) {
      container.innerHTML = '<div class="empty-note">No products found.</div>';
      return;
    }
    container.innerHTML = products.map(p => `
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4"><img src="${p.image || '/images/placeholder.png'}" class="img-fluid rounded-start" alt=""></div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${escapeHtml(p.name)}</h5>
              <p class="card-text">${escapeHtml(p.description || '')}</p>
              <p class="card-text"><strong>$${(p.price||0).toFixed(2)}</strong> <small class="text-muted">${escapeHtml(p.category)}</small></p>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderPagination(page, total) {
    if (!pagination) return;
    if (total <= 1) { pagination.innerHTML = ''; return; }
    const prev = page > 1 ? `<button class="btn btn-sm btn-outline-primary mx-1" data-page="${page-1}">Prev</button>` : '';
    const next = page < total ? `<button class="btn btn-sm btn-outline-primary mx-1" data-page="${page+1}">Next</button>` : '';
    pagination.innerHTML = `${prev} Page ${page} of ${total} ${next}`;
    pagination.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', () => { state.page = +btn.dataset.page; load(); });
    });
  }

  function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

  const form = document.getElementById('products-filter-form');
  if (form) form.addEventListener('submit', (e)=>{ e.preventDefault(); state.page = 1; load(); });

  load();
})();
