import { Manrope, Inter, IBM_Plex_Mono } from 'next/font/google';
import { isAuthenticated } from '@/lib/auth';
import { logout } from '@/app/login/actions';
import './globals.css';

const display = Manrope({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'Biblioteca Escolar — Normal Superior Santa Clara Almaguer',
  description: 'Inventario del material bibliográfico de la biblioteca escolar.',
  openGraph: {
    title: 'Biblioteca Escolar — Normal Superior Santa Clara Almaguer',
    description: 'Consulta el inventario de material bibliográfico de la biblioteca escolar.',
    type: 'website',
  },
};

export default async function RootLayout({ children }) {
  const authed = isAuthenticated();

  return (
    <html lang="es" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <header className="site-header">
          <a href="/" style={{ textDecoration: 'none' }}>
            <div className="brand-mark">
              <div className="brand-icon">BE</div>
              <div>
                <h1>Biblioteca Escolar</h1>
                <div className="subtitle">Normal Superior Santa Clara Almaguer</div>
              </div>
            </div>
          </a>
          <nav className="main-nav">
            <a href="/">Dashboard</a>
            <a href="/inventario">Inventario</a>
            <a href="/libros/nuevo" className="btn btn-primary" style={{ marginLeft: 8 }}>
              + Agregar libro
            </a>
            {authed ? (
              <form action={logout} style={{ marginLeft: 4 }}>
                <button type="submit" className="btn btn-outline">
                  Cerrar sesión
                </button>
              </form>
            ) : (
              <a href="/login" className="btn btn-outline" style={{ marginLeft: 4 }}>
                Iniciar sesión
              </a>
            )}
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <span>Biblioteca Escolar — Institución Educativa Normal Superior Santa Clara Almaguer</span>
          <span className="footer-sep">·</span>
          <span>Sistema de inventario bibliográfico</span>
        </footer>
      </body>
    </html>
  );
}
