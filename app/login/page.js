import { login } from './actions';

export default function LoginPage({ searchParams }) {
  const next = searchParams?.next || '/';
  const hasError = searchParams?.error === '1';

  return (
    <div className="login-wrap">
      <h1 className="login-title">Iniciar sesión</h1>
      <p className="login-sub">
        Solo necesario para agregar, editar o eliminar libros. Consultar el inventario no
        requiere iniciar sesión.
      </p>

      {hasError && (
        <div className="notas notas-error login-alert" role="alert">
          Contraseña incorrecta. Intenta de nuevo.
        </div>
      )}

      <form action={login} className="form-card login-form">
        <input type="hidden" name="next" value={next} />
        <div className="form-grid form-grid-single">
          <div>
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" required autoFocus />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Entrar
          </button>
          <a href="/">Volver al inventario</a>
        </div>
      </form>
    </div>
  );
}
