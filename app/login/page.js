import { login } from './actions';

export default function LoginPage({ searchParams }) {
  const next = searchParams?.next || '/';
  const hasError = searchParams?.error === '1';

  return (
    <div style={{ maxWidth: 380, margin: '60px auto' }}>
      <h2 style={{ marginBottom: 6 }}>Iniciar sesión</h2>
      <p style={{ color: 'var(--text-soft)', fontSize: '0.88rem', marginBottom: 20 }}>
        Solo necesario para agregar, editar o eliminar libros. Consultar el inventario no
        requiere iniciar sesión.
      </p>

      {hasError && (
        <div className="notas" style={{ marginBottom: 16 }}>
          Contraseña incorrecta. Intenta de nuevo.
        </div>
      )}

      <form action={login} className="form-card" style={{ maxWidth: '100%' }}>
        <input type="hidden" name="next" value={next} />
        <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" required autoFocus />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Entrar
          </button>
          <a href="/">Volver al Dashboard</a>
        </div>
      </form>
    </div>
  );
}
