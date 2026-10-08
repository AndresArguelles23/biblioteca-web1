import { supabase, fetchAllRows } from '@/lib/supabase';
import EstadoDonutChart from '@/components/EstadoDonutChart';
import CategoriaBarChart from '@/components/CategoriaBarChart';
import DecadaBarChart from '@/components/DecadaBarChart';
import AutorBarChart from '@/components/AutorBarChart';

export const dynamic = 'force-dynamic';

const ANIO_MIN = 1900;
const ANIO_MAX = new Date().getFullYear() + 1;

async function getStats() {
  const [{ count: total }, { count: malos }] = await Promise.all([
    supabase.from('libros').select('id', { count: 'exact', head: true }),
    supabase.from('libros').select('id', { count: 'exact', head: true }).eq('estado', 'M'),
  ]);
  return { total: total || 0, malos: malos || 0 };
}

async function getAggregates() {
  const rows = await fetchAllRows('categoria,estado,cantidad,anio,autor');

  const porCategoria = new Map();
  const porAutor = new Map();
  const porEstado = { B: 0, R: 0, M: 0 };
  const porDecada = new Map();
  let ejemplares = 0;

  rows.forEach((r) => {
    if (r.categoria) {
      porCategoria.set(r.categoria, (porCategoria.get(r.categoria) || 0) + 1);
    }
    if (r.autor) {
      const autor = r.autor.trim();
      if (autor) porAutor.set(autor, (porAutor.get(autor) || 0) + 1);
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

  const autoresOrdenados = Array.from(porAutor.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const decadasOrdenadas = Array.from(porDecada.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([decada, value]) => ({ name: `${decada}`, value }));

  return {
    categorias: categoriasOrdenadas,
    categoriasTotal: porCategoria.size,
    autores: autoresOrdenados,
    porEstado,
    ejemplares,
    decadas: decadasOrdenadas,
  };
}

async function getRecientes() {
  const { data } = await supabase
    .from('libros')
    .select('id,titulo,texto_original,autor,categoria,created_at')
    .order('created_at', { ascending: false })
    .limit(6);
  return data || [];
}

export default async function DashboardPage() {
  const [stats, agg, recientes] = await Promise.all([
    getStats(),
    getAggregates(),
    getRecientes(),
  ]);

  const estadoData = [
    { name: 'Bueno', value: agg.porEstado.B },
    { name: 'Regular', value: agg.porEstado.R },
    { name: 'Malo', value: agg.porEstado.M },
  ];

  return (
    <>
      <div className="dash-intro">
        <span className="eyebrow">Dashboard</span>
        <h1>Estadísticas del inventario</h1>
        <p>Indicadores y distribución general de la colección de la biblioteca escolar.</p>
      </div>

      <div className="stats-row">
        <div className="stat-card stat-card-feature">
          <div className="stat-value">{stats.total.toLocaleString('es-CO')}</div>
          <div className="stat-label">Libros en el inventario</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{agg.ejemplares.toLocaleString('es-CO')}</div>
          <div className="stat-label">Ejemplares totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{agg.categoriasTotal.toLocaleString('es-CO')}</div>
          <div className="stat-label">Categorías registradas</div>
        </div>
        <a href="/?estado=M" className="stat-card stat-card-link stat-card-danger">
          <div className="stat-value">{stats.malos.toLocaleString('es-CO')}</div>
          <div className="stat-label">En mal estado</div>
        </a>
      </div>

      <div className="dash-grid">
        <div className="panel panel-span-5">
          <h3>Distribución por estado</h3>
          <EstadoDonutChart data={estadoData} />
        </div>

        <div className="panel panel-span-7">
          <div className="panel-head">
            <h3>Libros por categoría (top 8)</h3>
            <a href="/">Ver catálogo</a>
          </div>
          <CategoriaBarChart data={agg.categorias} />
        </div>

        <div className="panel panel-span-7">
          <h3>Autores con más obras en la colección</h3>
          {agg.autores.length > 0 ? (
            <AutorBarChart data={agg.autores} />
          ) : (
            <p style={{ fontSize: '0.86rem' }}>No hay suficientes datos de autor todavía.</p>
          )}
        </div>

        <div className="panel panel-span-5">
          <div className="panel-head">
            <h3>Agregados recientemente</h3>
          </div>
          {recientes.length > 0 ? (
            <div className="mini-list">
              {recientes.map((libro) => (
                <a key={libro.id} href={`/libros/${libro.id}`} className="mini-item">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="mini-titulo clamp-2">
                      {libro.texto_original || libro.titulo || '(sin descripción)'}
                    </div>
                    <div className="mini-sub">{libro.autor || libro.categoria || '—'}</div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.86rem' }}>Todavía no se han agregado libros.</p>
          )}
        </div>

        <div className="panel panel-span-12">
          <h3>Libros por década de publicación</h3>
          <DecadaBarChart data={agg.decadas} />
        </div>
      </div>

      <div className="dash-actions">
        <a href="/" className="btn btn-primary">
          Ver inventario completo
        </a>
        <a href="/?estado=M" className="btn btn-outline">
          Libros en mal estado ({stats.malos})
        </a>
        <a href="/libros/nuevo" className="btn btn-outline">
          Agregar libro
        </a>
      </div>
    </>
  );
}
