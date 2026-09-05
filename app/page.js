import { supabase, fetchAllRows } from '@/lib/supabase';
import EstadoDonutChart from '@/components/EstadoDonutChart';
import CategoriaBarChart from '@/components/CategoriaBarChart';

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
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  return { categorias: categoriasOrdenadas, porEstado, ejemplares };
}

async function getRecientes() {
  const { data } = await supabase
    .from('libros')
    .select('id,clase,texto_original')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(5);
  return data || [];
}

async function getEnMalEstado() {
  const { data } = await supabase
    .from('libros')
    .select('id,clase,texto_original')
    .eq('estado', 'M')
    .order('clase', { ascending: true })
    .limit(5);
  return data || [];
}

export default async function DashboardPage() {
  const [stats, agg, recientes, malos] = await Promise.all([
    getStats(),
    getAggregates(),
    getRecientes(),
    getEnMalEstado(),
  ]);

  const estadoData = [
    { name: 'Bueno', value: agg.porEstado.B },
    { name: 'Regular', value: agg.porEstado.R },
    { name: 'Malo', value: agg.porEstado.M },
  ];
  const pctRevisado = stats.total > 0
    ? Math.round(((stats.total - stats.revisar) / stats.total) * 100)
    : 100;

  return (
    <>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.total.toLocaleString('es-CO')}</div>
          <div className="stat-label">Libros en el inventario</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{agg.ejemplares.toLocaleString('es-CO')}</div>
          <div className="stat-label">Ejemplares totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.malos.toLocaleString('es-CO')}</div>
          <div className="stat-label">En mal estado</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{pctRevisado}%</div>
          <div className="stat-label">Inventario revisado ({stats.revisar.toLocaleString('es-CO')} pendientes)</div>
        </div>
      </div>

      <div className="dash-stack">
        <div className="panel">
          <h3>Distribución por estado</h3>
          <EstadoDonutChart data={estadoData} />
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Libros por categoría (top 8)</h3>
            <a href="/inventario">Ver inventario →</a>
          </div>
          <CategoriaBarChart data={agg.categorias} />
        </div>

        <div className="panel">
          <h3>Agregados recientemente</h3>
          <div className="mini-list">
            {recientes.length === 0 && (
              <span className="mini-sub">Aún no hay registros recientes.</span>
            )}
            {recientes.map((libro) => (
              <a key={libro.id} className="mini-item" href={`/libros/${libro.id}`}>
                <span className="mini-titulo-1l">{libro.texto_original || '(sin descripción)'}</span>
                <span className="clase-badge mono">{libro.clase}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="panel">
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
                  <span className="mini-titulo-1l">{libro.texto_original || '(sin descripción)'}</span>
                  <span className="clase-badge mono">{libro.clase}</span>
                </a>
              ))}
            </div>
          )}
        </div>
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
