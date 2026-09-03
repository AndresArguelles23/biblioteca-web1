import { supabase, fetchAllRows } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 30;
const LIST_COLUMNS = 'id,clase,titulo,autor,anio,categoria,estado,revisar,texto_original';

const SORT_OPTIONS = {
  clase: { column: 'clase', label: 'Clase' },
  titulo: { column: 'titulo', label: 'Descripción' },
  autor: { column: 'autor', label: 'Autor' },
  anio: { column: 'anio', label: 'Año' },
};

async function getCategoriasConConteo() {
  // fetchAllRows pagina automáticamente: con .select() normal, Supabase
  // corta en 1000 filas y varias categorías del final de la lista no
  // aparecían nunca en el filtro.
  const rows = await fetchAllRows('categoria');
  const counts = new Map();
  rows.forEach((r) => {
    if (!r.categoria) return;
    counts.set(r.categoria, (counts.get(r.categoria) || 0) + 1);
  });
  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([nombre, total]) => ({ nombre, total }));
}

async function getLibros(params) {
  const page = Math.max(parseInt(params.page || '1', 10), 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase.from('libros').select(LIST_COLUMNS, { count: 'exact' });

  if (params.q) {
    const q = params.q.trim();
    query = query.or(
      `titulo.ilike.%${q}%,autor.ilike.%${q}%,clase.ilike.%${q}%,isbn.ilike.%${q}%,texto_original.ilike.%${q}%`
    );
  }
  if (params.categoria) {
    query = query.eq('categoria', params.categoria);
  }
  if (params.estado) {
    query = query.eq('estado', params.estado);
  }
  if (params.revisar === '1') {
    query = query.eq('revisar', true);
  }

  const sortKey = SORT_OPTIONS[params.sort] ? params.sort : 'clase';
  const ascending = params.dir !== 'desc';
  query = query
    .order(SORT_OPTIONS[sortKey].column, { ascending, nullsFirst: false })
    .range(from, to);

  const { data, count, error } = await query;
  return { data: data || [], count: count || 0, page, error };
}

function qs(params, overrides) {
  const merged = { ...params, ...overrides };
  const usp = new URLSearchParams();
  Object.entries(merged).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.set(k, v);
  });
  const s = usp.toString();
  return s ? `/inventario?${s}` : '/inventario';
}

const ESTADO_LABEL = { B: 'Bueno', R: 'Regular', M: 'Malo' };

export default async function InventarioPage({ searchParams }) {
  const params = searchParams || {};
  const [categorias, { data: libros, count, page, error }] = await Promise.all([
    getCategoriasConConteo(),
    getLibros(params),
  ]);

  const totalPages = Math.max(Math.ceil(count / PAGE_SIZE), 1);
  const hasFilters = params.q || params.categoria || params.estado || params.revisar;
  const sortKey = SORT_OPTIONS[params.sort] ? params.sort : 'clase';
  const dir = params.dir === 'desc' ? 'desc' : 'asc';

  return (
    <>
      <form className="filters" method="GET">
        <div className="field" style={{ flex: '1 1 220px' }}>
          <label htmlFor="q">Buscar</label>
          <input
            id="q"
            name="q"
            placeholder="Título, autor, clase o ISBN..."
            defaultValue={params.q || ''}
          />
        </div>
        <div className="field">
          <label htmlFor="categoria">Categoría</label>
          <select id="categoria" name="categoria" defaultValue={params.categoria || ''}>
            <option value="">Todas ({categorias.reduce((s, c) => s + c.total, 0)})</option>
            {categorias.map((c) => (
              <option key={c.nombre} value={c.nombre}>
                {c.nombre} ({c.total})
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="estado">Estado</label>
          <select id="estado" name="estado" defaultValue={params.estado || ''}>
            <option value="">Todos</option>
            <option value="B">Bueno</option>
            <option value="R">Regular</option>
            <option value="M">Malo</option>
          </select>
        </div>
        <div className="field sort-field">
          <label htmlFor="sort">Ordenar por</label>
          <select id="sort" name="sort" defaultValue={sortKey}>
            {Object.entries(SORT_OPTIONS).map(([key, opt]) => (
              <option key={key} value={key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="dir">Dirección</label>
          <select id="dir" name="dir" defaultValue={dir}>
            <option value="asc">A → Z / menor a mayor</option>
            <option value="desc">Z → A / mayor a menor</option>
          </select>
        </div>
        <label className="check-field" htmlFor="revisar">
          <input
            type="checkbox"
            id="revisar"
            name="revisar"
            value="1"
            defaultChecked={params.revisar === '1'}
          />
          Solo pendientes de revisar
        </label>
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
      </form>

      <div className="summary-bar">
        <span>
          {count} {count === 1 ? 'libro encontrado' : 'libros encontrados'}
        </span>
        {hasFilters && <a href="/inventario">Limpiar filtros</a>}
      </div>

      {error && <p className="notas">Error consultando la base de datos: {error.message}</p>}

      {libros.length === 0 && !error ? (
        <div className="empty-state">
          <p>No hay libros que coincidan con esta búsqueda.</p>
          <a href="/libros/nuevo" className="btn btn-primary" style={{ marginTop: 10 }}>
            + Agregar el primer libro
          </a>
        </div>
      ) : (
        <>
          {/* Vista de escritorio */}
          <div className="book-table-wrap">
            <table className="book-table">
              <thead>
                <tr>
                  <th style={{ width: 110 }}>Clase</th>
                  <th>Descripción</th>
                  <th style={{ width: 180 }}>Categoría</th>
                  <th style={{ width: 70 }}>Año</th>
                  <th style={{ width: 140 }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {libros.map((libro) => (
                  <tr key={libro.id} className="row-link">
                    <td>
                      <a className="row-anchor" href={`/libros/${libro.id}`}>
                        <span className="clase-badge mono">{libro.clase || '—'}</span>
                      </a>
                    </td>
                    <td>
                      <a className="row-anchor" href={`/libros/${libro.id}`}>
                        <div className="td-titulo clamp-2">
                          {libro.texto_original || libro.titulo || '(sin descripción)'}
                        </div>
                      </a>
                    </td>
                    <td>
                      <a className="row-anchor" href={`/libros/${libro.id}`}>
                        {libro.categoria || '—'}
                      </a>
                    </td>
                    <td>
                      <a className="row-anchor" href={`/libros/${libro.id}`}>
                        {libro.anio || '—'}
                      </a>
                    </td>
                    <td>
                      <a className="row-anchor" href={`/libros/${libro.id}`}>
                        <div className="badges">
                          {libro.estado && (
                            <span className={`badge badge-${libro.estado}`}>
                              {ESTADO_LABEL[libro.estado] || libro.estado}
                            </span>
                          )}
                          {libro.revisar && (
                            <span className="alert-flag" title="Pendiente de revisar">
                              ⚠
                            </span>
                          )}
                        </div>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista de celular */}
          <div className="mobile-book-list">
            {libros.map((libro) => (
              <a key={libro.id} className="mobile-card" href={`/libros/${libro.id}`}>
                <div className="top-row">
                  <span className="clase-badge mono">{libro.clase || '—'}</span>
                  <div className="badges">
                    {libro.estado && (
                      <span className={`badge badge-${libro.estado}`}>
                        {ESTADO_LABEL[libro.estado] || libro.estado}
                      </span>
                    )}
                    {libro.revisar && (
                      <span className="alert-flag" title="Pendiente de revisar">
                        ⚠
                      </span>
                    )}
                  </div>
                </div>
                <div className="card-titulo clamp-2">
                  {libro.texto_original || libro.titulo || '(sin descripción)'}
                </div>
                <div className="card-meta">{libro.categoria}</div>
              </a>
            ))}
          </div>
        </>
      )}

      <div className="pagination">
        <a href={qs(params, { page: page - 1 })} className={page <= 1 ? 'disabled' : ''}>
          ← Anterior
        </a>
        <span>
          Página {page} de {totalPages}
        </span>
        <a
          href={qs(params, { page: page + 1 })}
          className={page >= totalPages ? 'disabled' : ''}
        >
          Siguiente →
        </a>
      </div>
    </>
  );
}
