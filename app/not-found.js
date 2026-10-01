export default function NotFound() {
  return (
    <div className="all-done not-found">
      <div className="big-check" aria-hidden="true">📚</div>
      <h2>No encontramos esta página</h2>
      <p className="not-found-text">
        Puede que el libro haya sido eliminado, o que el enlace esté incompleto.
      </p>
      <div className="not-found-actions">
        <a href="/" className="btn btn-primary">
          Volver al Dashboard
        </a>
        <a href="/inventario" className="btn btn-outline">
          Ver inventario
        </a>
      </div>
    </div>
  );
}
