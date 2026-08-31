import { supabase } from '@/lib/supabase';
import { reviewSave } from '@/app/actions';

export const dynamic = 'force-dynamic';

async function getSiguientePendiente(afterId) {
  let query = supabase
    .from('libros')
    .select('*')
    .eq('revisar', true)
    .order('id', { ascending: true })
    .limit(1);

  if (afterId) {
    query = query.gt('id', afterId);
  }

  const { data } = await query;
  if (data && data.length > 0) return data[0];

  // Si ya recorrimos todos los pendientes desde "after" en adelante,
  // volvemos a empezar desde el principio (puede quedar alguno antes del
  // punto donde se estaba saltando).
  if (afterId) {
    const { data: fromStart } = await supabase
      .from('libros')
      .select('*')
      .eq('revisar', true)
      .order('id', { ascending: true })
      .limit(1);
    return fromStart && fromStart.length > 0 ? fromStart[0] : null;
  }
  return null;
}

async function getProgreso() {
  const [{ count: total }, { count: pendientes }] = await Promise.all([
    supabase.from('libros').select('id', { count: 'exact', head: true }),
    supabase.from('libros').select('id', { count: 'exact', head: true }).eq('revisar', true),
  ]);
  const totalNum = total || 0;
  const pendientesNum = pendientes || 0;
  const revisados = totalNum - pendientesNum;
  const porcentaje = totalNum > 0 ? Math.round((revisados / totalNum) * 100) : 100;
  return { pendientes: pendientesNum, porcentaje };
}

export default async function RevisarPage({ searchParams }) {
  const afterId = searchParams?.after ? parseInt(searchParams.after, 10) : null;
  const [libro, progreso] = await Promise.all([
    getSiguientePendiente(afterId),
    getProgreso(),
  ]);

  if (!libro) {
    return (
      <div className="all-done">
        <div className="big-check">✅</div>
        <h2>¡Todo revisado!</h2>
        <p style={{ color: 'var(--text-soft)', marginTop: 8 }}>
          No quedan libros pendientes de revisar.
        </p>
        <a href="/" className="btn btn-primary" style={{ marginTop: 16 }}>
          Volver al Dashboard
        </a>
      </div>
    );
  }

  const boundSave = reviewSave.bind(null, libro.id);

  return (
    <>
      <a href="/" className="back-link">
        ← Volver al Dashboard
      </a>
      <h2 style={{ marginBottom: 4 }}>Cola de revisión</h2>
      <p style={{ color: 'var(--text-soft)', fontSize: '0.86rem', marginBottom: 14 }}>
        Clase <span className="mono">{libro.clase}</span>
      </p>

      <div className="review-progress">
        <span style={{ fontSize: '0.82rem', color: 'var(--text-soft)', whiteSpace: 'nowrap' }}>
          {progreso.pendientes} pendientes · {progreso.porcentaje}% revisado
        </span>
        <div className="review-progress-track">
          <div className="review-progress-fill" style={{ width: `${progreso.porcentaje}%` }} />
        </div>
      </div>

      {libro.texto_original && (
        <div className="review-original">
          <strong>Texto original:</strong> {libro.texto_original}
        </div>
      )}

      {libro.notas_revision && (
        <div className="notas">Pendiente: {libro.notas_revision}</div>
      )}

      <form action={boundSave} className="form-card">
        <div className="form-grid">
          <div>
            <label htmlFor="clase">Clase</label>
            <input id="clase" name="clase" defaultValue={libro.clase || ''} />
          </div>
          <div>
            <label htmlFor="categoria">Categoría</label>
            <input id="categoria" name="categoria" defaultValue={libro.categoria || ''} />
          </div>
          <div className="full">
            <label htmlFor="titulo">Título</label>
            <input id="titulo" name="titulo" defaultValue={libro.titulo || ''} required />
          </div>
          <div>
            <label htmlFor="autor">Autor</label>
            <input
              id="autor"
              name="autor"
              defaultValue={libro.autor || ''}
              placeholder="Apellido, Nombre"
            />
          </div>
          <div>
            <label htmlFor="anio">Año</label>
            <input id="anio" name="anio" type="number" defaultValue={libro.anio ?? ''} />
          </div>
          <div>
            <label htmlFor="editorial">Editorial</label>
            <input id="editorial" name="editorial" defaultValue={libro.editorial || ''} />
          </div>
          <div>
            <label htmlFor="isbn">ISBN</label>
            <input id="isbn" name="isbn" defaultValue={libro.isbn || ''} />
          </div>
          <div>
            <label htmlFor="edicion">Edición</label>
            <input id="edicion" name="edicion" type="number" defaultValue={libro.edicion ?? ''} />
          </div>
          <div>
            <label htmlFor="ciudad">Ciudad</label>
            <input id="ciudad" name="ciudad" defaultValue={libro.ciudad || ''} />
          </div>
          <div>
            <label htmlFor="pagina">Páginas</label>
            <input id="pagina" name="pagina" type="number" defaultValue={libro.pagina ?? ''} />
          </div>
          <div>
            <label htmlFor="cantidad">Cantidad</label>
            <input
              id="cantidad"
              name="cantidad"
              type="number"
              min="0"
              defaultValue={libro.cantidad ?? 1}
            />
          </div>
          <div>
            <label htmlFor="ubicacion">Ubicación</label>
            <input id="ubicacion" name="ubicacion" defaultValue={libro.ubicacion || 'Biblioteca'} />
          </div>
          <div className="full">
            <label>Estado del ejemplar</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="estado" value="B" defaultChecked={libro.estado === 'B' || !libro.estado} /> Bueno
              </label>
              <label>
                <input type="radio" name="estado" value="R" defaultChecked={libro.estado === 'R'} /> Regular
              </label>
              <label>
                <input type="radio" name="estado" value="M" defaultChecked={libro.estado === 'M'} /> Malo
              </label>
            </div>
          </div>
          <input type="hidden" name="texto_original" value={libro.texto_original || ''} />
          <div className="full">
            <label htmlFor="notas_revision">
              Notas (si dejas esto lleno y no marcas "Revisado", seguirá en la cola)
            </label>
            <input id="notas_revision" name="notas_revision" defaultValue={libro.notas_revision || ''} />
          </div>
          <div className="full">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
              <input type="checkbox" name="marcar_revisado" defaultChecked />
              Marcar como revisado (sale de la cola de pendientes)
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Guardar y siguiente →
          </button>
          <a href={`/revisar?after=${libro.id}`}>Saltar por ahora</a>
        </div>
      </form>
    </>
  );
}
