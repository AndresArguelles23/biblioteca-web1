import BookForm from '@/components/BookForm';
import { addBook } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default function NuevoLibroPage({ searchParams }) {
  const error = searchParams?.error;
  return (
    <>
      <a href="/inventario" className="back-link">
        ← Volver al inventario
      </a>
      <h2 className="detail-title" style={{ marginBottom: 16 }}>Agregar libro</h2>
      <p className="detail-desc">Completa los datos del ejemplar para sumarlo al catálogo.</p>
      <BookForm action={addBook} submitLabel="Guardar libro" error={error} />
    </>
  );
}
