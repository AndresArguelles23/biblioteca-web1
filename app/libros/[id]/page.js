import { supabase } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';
import DeleteButton from '@/components/DeleteButton';
import { deleteBook } from '@/app/actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const ESTADO_LABEL = { B: 'Bueno', R: 'Regular', M: 'Malo' };

function Field({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="detail-item">
      <div className="detail-item-label">{label}</div>
      <div className="detail-item-value">{value}</div>
    </div>
  );
}

export default async function LibroDetailPage({ params, searchParams }) {
  const { id } = params;
  const deleteError = searchParams?.error;
  const authed = isAuthenticated();

  const { data: libro, error: fetchError } = await supabase
    .from('libros')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !libro) {
    notFound();
  }

  const boundDelete = deleteBook.bind(null, id);

  return (
    <>
      <a href="/" className="back-link">
        ← Volver al inventario
      </a>

      {deleteError && (
        <div className="notas notas-error" role="alert">
          {deleteError}
        </div>
      )}

      <div className="detail-head">
        <div>
          {libro.clase && <span className="clase-badge mono">{libro.clase}</span>}
          <h1 className="detail-title">{libro.titulo || libro.texto_original || '(sin título)'}</h1>
          {libro.autor && <p className="detail-meta">{libro.autor}</p>}
        </div>
        {libro.estado && (
          <span className={`badge badge-${libro.estado} detail-estado-badge`}>
            {ESTADO_LABEL[libro.estado] || libro.estado}
          </span>
        )}
      </div>

      {authed && (
        <div className="detail-admin-actions">
          <a href={`/libros/${id}/editar`} className="btn btn-outline">
            Editar libro
          </a>
          <DeleteButton action={boundDelete} titulo={libro.texto_original || libro.titulo} />
        </div>
      )}

      <div className="panel">
        <h3>Información del ejemplar</h3>
        <div className="detail-grid">
          <Field label="Categoría" value={libro.categoria} />
          <Field label="Subcategoría" value={libro.subcategoria} />
          <Field label="Edición" value={libro.edicion} />
          <Field label="Año" value={libro.anio} />
          <Field label="Ciudad" value={libro.ciudad} />
          <Field label="Editorial" value={libro.editorial} />
          <Field label="Páginas" value={libro.pagina} />
          <Field label="Ilustrador" value={libro.ilustrador} />
          <Field label="ISBN" value={libro.isbn} />
          <Field label="Cantidad" value={libro.cantidad} />
          <Field label="Ubicación" value={libro.ubicacion} />
        </div>

        {libro.texto_original && (
          <div className="detail-original">
            <div className="detail-item-label" style={{ marginBottom: 6 }}>
              Descripción completa
            </div>
            <p style={{ margin: 0 }}>{libro.texto_original}</p>
          </div>
        )}
      </div>

      {!authed && (
        <p className="detail-login-hint">
          <a href={`/login?next=${encodeURIComponent(`/libros/${id}/editar`)}`}>Inicia sesión</a> para
          editar o eliminar este libro.
        </p>
      )}
    </>
  );
}
