import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import { isAuthenticated } from '@/lib/auth';
import { logout } from '@/app/login/actions';
import NavLinks from '@/components/NavLinks';
import './globals.css';

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'Biblioteca Escolar — Normal Superior Santa Clara Almaguer',
  description: 'Catálogo e inventario del material bibliográfico de la biblioteca escolar.',
  openGraph: {
    title: 'Biblioteca Escolar — Normal Superior Santa Clara Almaguer',
    description: 'Consulta el inventario de material bibliográfico de la biblioteca escolar.',
    type: 'website',
  },
};

export default async function RootLayout({ children }) {
  const authed = await isAuthenticated();

  return (
    <html lang="es" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <a href="/" className="brand-mark">
              <svg className="brand-icon" viewBox="0 0 32 32" aria-hidden="true">
                <defs>
                  <linearGradient id="brandGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#4F46E5" />
                    <stop offset="1" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="8" fill="url(#brandGrad)" />
                <path d="M9 10.5C9 9.7 9.7 9 10.5 9H16V22.5L15.3 22.2C13.7 21.5 12 21.1 10.3 21.1H9V10.5Z" fill="#fff" fillOpacity="0.95" />
                <path d="M23 10.5C23 9.7 22.3 9 21.5 9H16V22.5L16.7 22.2C18.3 21.5 20 21.1 21.7 21.1H23V10.5Z" fill="#fff" fillOpacity="0.65" />
              </svg>
              <span className="brand-text">
                <span className="brand-name">Biblioteca Escolar</span>
                <span className="brand-sub">Normal Superior Santa Clara Almaguer</span>
              </span>
            </a>
            <nav className="main-nav" aria-label="Navegación principal">
              <NavLinks />
            </nav>
            <div className="header-actions">
              {authed && (
                <a href="/libros/nuevo" className="btn btn-primary nav-cta">
                  Agregar libro
                </a>
              )}
              {authed ? (
                <form action={logout} className="nav-session">
                  <button type="submit" className="btn btn-ghost">
                    Cerrar sesión
                  </button>
                </form>
              ) : (
                <a href="/login" className="btn btn-ghost nav-session">
                  Iniciar sesión
                </a>
              )}
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="site-footer-inner">
            <p>Institución Educativa Normal Superior Santa Clara Almaguer</p>
            <p className="footer-faint">Sistema de catálogo e inventario bibliográfico</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
