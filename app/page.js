import { supabase, fetchAllRows } from '@/lib/supabase';
import EstadoDonutChart from '@/components/EstadoDonutChart';
import CategoriaBarChart from '@/components/CategoriaBarChart';
import RevisionRadialChart from '@/components/RevisionRadialChart';
import DecadaBarChart from '@/components/DecadaBarChart';

export const dynamic = 'force-dynamic';

const ANIO_MIN = 1900;
const ANIO_MAX = new Date().getFullYear() + 1;

async function getStats() {
  const [{ count: total }, { count: revisar }, { count: malos }] = await Promise.all([
    supabase.from('libros').select('id', { count: 'exact', head: true }),
    supabase.from('libros').select('id', { count: 'exact', head: true }).eq('revisar', true),
    supabase.from('libros').select('id', { count: 'exact', head: true }).eq('estado', 'M'),
  ]);
  return { total: total || 0, revisar: revisar || 0, malos: malos || 0 };
}

async function getAggregates() {
  const rows = await fetchAllRows('categoria,estado,cantidad,anio');

  const porCategoria = new Map();
  const porEstado = { B: 0, R: 0, M: 0 };
  const porDecada = new Map();
  let ejemplares = 0;

  rows.forEach((r) => {
    if (r.categoria) {
      porCategoria.set(r.categoria, (porCategoria.get(r.categoria) || 0) + 1);
    }
    if (r.estado && porEstado[r.estado] !== undefined) {
      porEstado[r.estado] += 1;
    }
    ejemplares += Number(r.cantidad) || 0;

    const anio = Number(r.anio);
    if (anio && anio >= ANIO_MIN && anio <= ANIO_MAX) {
      const decada = Math.floor(anio / 10) * 10;
      porDecada.set(decada, (porDecada.get(decada) || 0) + 1);
    }
  });

  const categoriasOrdenadas = Array.from(porCategoria.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  const decadasOrdenadas = Array.from(porDecada.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([decada, value]) => ({ name: `${decada}`, value }));

  return { categorias: categoriasOrdenadas, porEstado, ejemplares, decadas: decadasOrdenadas };
}

export default async function DashboardPage() {
  const [stats, agg] = await Promise.all([getStats(), getAggregates()]);

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
          <div className="stat-label">Inventario revisado</div>
        </div>
      </div>

      <div className="dash-stack">
        <div className="panel">
          <h3>Distribución por estado</h3>
          <EstadoDonutChart data={estadoData} />
        </div>

        <div className="panel">
          <h3>Progreso de revisión del inventario</h3>
          <RevisionRadialChart porcentaje={pctRevisado} pendientes={stats.revisar} />
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Libros por categoría (top 8)</h3>
            <a href="/inventario">Ver inventario →</a>
          </div>
          <CategoriaBarChart data={agg.categorias} />
        </div>

        <div className="panel">
          <h3>Libros por década de publicación</h3>
          <DecadaBarChart data={agg.decadas} />
        </div>
      </div>

      <div className="dash-actions">
        <a href="/revisar" className="btn btn-primary">
          Ir a la cola de revisión ({stats.revisar})
        </a>
        <a href="/inventario" className="btn btn-outline">
          Ver inventario completo
        </a>
        <a href="/inventario?estado=M" className="btn btn-outline">
          Ver libros en mal estado ({stats.malos})
        </a>
        <a href="/libros/nuevo" className="btn btn-outline">
          + Agregar libro
        </a>
      </div>
    </>
  );
}
