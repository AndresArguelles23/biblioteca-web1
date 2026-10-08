export default function NotFound() {
  return (
    <div className="all-done not-found">
      <div className="big-check" aria-hidden="true">📚</div>
      <h1>No encontramos esta página</h1>
      <p className="not-found-text">
        Puede que el libro haya sido eliminado, o que el enlace esté incompleto.
      </p>
      <div className="not-found-actions">
        <a href="/" className="btn btn-primary">
          Ver inventario
        </a>
      </div>
    </div>
  );
}
