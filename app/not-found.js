export default function NotFound() {
  return (
    <div className="all-done" style={{ marginTop: 40 }}>
      <div className="big-check">📚</div>
      <h2>No encontramos esta página</h2>
      <p style={{ color: 'var(--text-soft)', marginTop: 8, maxWidth: 420, marginInline: 'auto' }}>
        Puede que el libro haya sido eliminado, o que el enlace esté incompleto.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
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
