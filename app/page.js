import { supabase, fetchAllRows } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';
import PrintButton from '@/components/PrintButton';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 30;
const LIST_COLUMNS = 'id,clase,titulo,autor,categoria,estado,texto_original';
const ESTADO_LABEL = { B: 'Bueno', R: 'Regular', M: 'Malo' };

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
  // El filtro de estado ya no tiene un control propio en la barra de
  // búsqueda (ver mejoras de UX), pero se mantiene soportado por URL para
  // los accesos directos del dashboard, p. ej. "Libros en mal estado".
  if (params.estado) {
    query = query.eq('estado', params.estado);
  }

  query = query.order('clase', { ascending: true, nullsFirst: false }).range(from, to);

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
  return s ? `/?${s}` : '/';
}

export default async function InventarioPage({ searchParams }) {
  const params = searchParams || {};
  const authed = isAuthenticated();
  const [categorias, { data: libros, count, page, error }] = await Promise.all([
    getCategoriasConConteo(),
    getLibros(params),
  ]);

  const totalPages = Math.max(Math.ceil(count / PAGE_SIZE), 1);
  const hasFilters = params.q || params.categoria || params.estado;

  return (
    <>
      <div className="dash-intro">
        <span className="eyebrow">Inventario</span>
        <h1>Inventario de la biblioteca</h1>
        <p>Busca, filtra y consulta el material bibliográfico disponible.</p>
      </div>

      <form className="filters" method="GET">
        <div className="field" style={{ flex: '1 1 260px' }}>
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
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.nombre} value={c.nombre}>
                {c.nombre} ({c.total})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
      </form>

      <div className="summary-bar">
        <span>
          {count} {count === 1 ? 'libro encontrado' : 'libros encontrados'}
          {params.estado && ` · estado: ${ESTADO_LABEL[params.estado] || params.estado}`}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {hasFilters && <a href="/">Limpiar filtros</a>}
          <PrintButton />
        </div>
      </div>

      <div className="print-only print-header">
        <h2>Inventario — Biblioteca Escolar</h2>
        <p>Normal Superior Santa Clara Almaguer · Impreso el {new Date().toLocaleDateString('es-CO')}</p>
      </div>

      {error && <p className="notas">Error consultando la base de datos: {error.message}</p>}

      {libros.length === 0 && !error ? (
        <div className="empty-state">
          <p>No hay libros que coincidan con esta búsqueda.</p>
          {authed && (
            <a href="/libros/nuevo" className="btn btn-primary" style={{ marginTop: 10 }}>
              Agregar el primer libro
            </a>
          )}
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
                  <th style={{ width: 200 }}>Categoría</th>
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
                        <div className="badges">
                          {libro.estado && (
                            <span className={`badge badge-${libro.estado}`}>
                              {ESTADO_LABEL[libro.estado] || libro.estado}
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
        {page <= 1 ? (
          <span className="disabled" aria-disabled="true">← Anterior</span>
        ) : (
          <a href={qs(params, { page: page - 1 })}>← Anterior</a>
        )}
        <span>
          Página {page} de {totalPages}
        </span>
        {page >= totalPages ? (
          <span className="disabled" aria-disabled="true">Siguiente →</span>
        ) : (
          <a href={qs(params, { page: page + 1 })}>Siguiente →</a>
        )}
      </div>
    </>
  );
}
