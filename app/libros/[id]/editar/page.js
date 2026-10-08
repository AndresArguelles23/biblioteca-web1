import { supabase } from '@/lib/supabase';
import BookForm from '@/components/BookForm';
import DeleteButton from '@/components/DeleteButton';
import { updateBook, deleteBook } from '@/app/actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditarLibroPage({ params, searchParams }) {
  const { id } = params;
  const saveError = searchParams?.error;
  const { data: libro, error: fetchError } = await supabase
    .from('libros')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !libro) {
    notFound();
  }

  const boundUpdate = updateBook.bind(null, id);
  const boundDelete = deleteBook.bind(null, id);

  return (
    <>
      <a href={`/libros/${id}`} className="back-link">
        ← Volver al detalle
      </a>
      <span className="eyebrow">Edición</span>
      <h1 className="detail-title">Editar libro</h1>
      <p className="detail-meta">
        Clase <span className="mono">{libro.clase}</span>
      </p>
      <p className="detail-desc">
        {libro.texto_original || libro.titulo || '(sin descripción)'}
      </p>

      <BookForm action={boundUpdate} book={libro} submitLabel="Guardar cambios" error={saveError} />

      <div className="delete-zone">
        <DeleteButton action={boundDelete} titulo={libro.texto_original || libro.titulo} />
      </div>
    </>
  );
}
