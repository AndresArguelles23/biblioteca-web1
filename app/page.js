import { supabase, fetchAllRows } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [{ count: total }, { count: revisar }, { count: malos }] = await Promise.all([
    supabase.from('libros').select('id', { count: 'exact', head: true }),
    supabase.from('libros').select('id', { count: 'exact', head: true }).eq('revisar', true),
    supabase.from('libros').select('id', { count: 'exact', head: true }).eq('estado', 'M'),
  ]);
  return { total: total || 0, revisar: revisar || 0, malos: malos || 0 };
}

async function getAggregates() {
  // Traemos solo columnas livianas para armar los conteos por categoría,
  // estado y el total de ejemplares (paginando para no toparnos con el
  // límite de 1000 filas de Supabase).
  const rows = await fetchAllRows('categoria,estado,cantidad');

  const porCategoria = new Map();
  const porEstado = { B: 0, R: 0, M: 0 };
  let ejemplares = 0;

  rows.forEach((r) => {
    if (r.categoria) {
      porCategoria.set(r.categoria, (porCategoria.get(r.categoria) || 0) + 1);
    }
    if (r.estado && porEstado[r.estado] !== undefined) {
      porEstado[r.estado] += 1;
    }
    ejemplares += Number(r.cantidad) || 0;
  });

  const categoriasOrdenadas = Array.from(porCategoria.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return {
    categorias: categoriasOrdenadas,
    totalCategorias: porCategoria.size,
    porEstado,
    ejemplares,
  };
}

async function getRecientes() {
  const { data } = await supabase
    .from('libros')
    .select('id,titulo,autor,clase,categoria')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(6);
  return data || [];
}

async function getEnMalEstado() {
  const { data } = await supabase
    .from('libros')
    .select('id,titulo,autor,clase')
    .eq('estado', 'M')
    .order('clase', { ascending: true })
    .limit(6);
  return data || [];
}

const ESTADO_LABEL = { B: 'Bueno', R: 'Regular', M: 'Malo' };

export default async function DashboardPage() {
  const [stats, agg, recientes, malos] = await Promise.all([
    getStats(),
    getAggregates(),
    getRecientes(),
    getEnMalEstado(),
  ]);

  const maxCategoria = Math.max(...agg.categorias.map(([, v]) => v), 1);
  const maxEstado = Math.max(agg.porEstado.B, agg.porEstado.R, agg.porEstado.M, 1);

  return (
    <>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.total.toLocaleString('es-CO')}</div>
          <div className="stat-label">Títulos distintos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{agg.ejemplares.toLocaleString('es-CO')}</div>
          <div className="stat-label">Ejemplares totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{agg.totalCategorias}</div>
          <div className="stat-label">Categorías</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.revisar.toLocaleString('es-CO')}</div>
          <div className="stat-label">Pendientes de revisar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.malos.toLocaleString('es-CO')}</div>
          <div className="stat-label">En mal estado</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="panel">
          <div className="panel-head">
            <h3>Libros por categoría (top 8)</h3>
            <a href="/inventario">Ver inventario →</a>
          </div>
          {agg.categorias.map(([nombre, valor]) => (
            <div className="bar-row" key={nombre}>
              <div className="bar-label" title={nombre}>
                {nombre}
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(valor / maxCategoria) * 100}%` }} />
              </div>
              <div className="bar-value">{valor}</div>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Distribución por estado</h3>
          {['B', 'R', 'M'].map((key) => (
            <div className="bar-row" key={key}>
              <div className="bar-label">{ESTADO_LABEL[key]}</div>
              <div className="bar-track">
                <div
                  className={`bar-fill fill-${key}`}
                  style={{ width: `${(agg.porEstado[key] / maxEstado) * 100}%` }}
                />
              </div>
              <div className="bar-value">{agg.porEstado[key]}</div>
            </div>
          ))}

          <div style={{ marginTop: 22 }}>
            <div className="panel-head">
              <h3>Agregados recientemente</h3>
            </div>
            <div className="mini-list">
              {recientes.length === 0 && (
                <span className="mini-sub">Aún no hay registros recientes.</span>
              )}
              {recientes.map((libro) => (
                <a key={libro.id} className="mini-item" href={`/libros/${libro.id}`}>
                  <div style={{ minWidth: 0 }}>
                    <div className="mini-titulo">{libro.titulo || '(sin título)'}</div>
                    <div className="mini-sub">{libro.autor || 'Autor desconocido'}</div>
                  </div>
                  <span className="clase-badge mono">{libro.clase}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head">
          <h3>En mal estado — revisar reparación o baja</h3>
          <a href="/inventario?estado=M">Ver todos →</a>
        </div>
        {malos.length === 0 ? (
          <span className="mini-sub">No hay libros marcados como "Malo" en este momento. 🎉</span>
        ) : (
          <div className="mini-list">
            {malos.map((libro) => (
              <a key={libro.id} className="mini-item" href={`/libros/${libro.id}`}>
                <div style={{ minWidth: 0 }}>
                  <div className="mini-titulo">{libro.titulo || '(sin título)'}</div>
                  <div className="mini-sub">{libro.autor || 'Autor desconocido'}</div>
                </div>
                <span className="clase-badge mono">{libro.clase}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="dash-actions">
        <a href="/revisar" className="btn btn-primary">
          Ir a la cola de revisión ({stats.revisar})
        </a>
        <a href="/inventario" className="btn btn-outline">
          Ver inventario completo
        </a>
        <a href="/libros/nuevo" className="btn btn-outline">
          + Agregar libro
        </a>
      </div>
    </>
  );
}
