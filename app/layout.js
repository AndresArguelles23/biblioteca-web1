import { Fraunces, Source_Sans_3, IBM_Plex_Mono } from 'next/font/google';
import { isAuthenticated } from '@/lib/auth';
import { logout } from '@/app/login/actions';
import { supabase } from '@/lib/supabase';
import NavLinks from '@/components/NavLinks';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const body = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const mono = IBM_Plex_Mono({
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

async function getPendientesCount() {
  try {
    const { count } = await supabase
      .from('libros')
      .select('id', { count: 'exact', head: true })
      .eq('revisar', true);
    return count || 0;
  } catch {
    return 0;
  }
}

export default async function RootLayout({ children }) {
  const [authed, pendientes] = await Promise.all([
    isAuthenticated(),
    getPendientesCount(),
  ]);

  return (
    <html lang="es" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <a href="/" className="brand-mark">
              <svg className="brand-icon" viewBox="0 0 32 32" aria-hidden="true">
                <rect width="32" height="32" rx="6" fill="#18352B" />
                <path d="M7 9.2C7 8.1 7.9 7.2 9 7.2H15.4V23.6L14.6 23.2C13 22.4 11.2 22 9.4 22H7V9.2Z" fill="#F4EEDF" />
                <path d="M25 9.2C25 8.1 24.1 7.2 23 7.2H16.6V23.6L17.4 23.2C19 22.4 20.8 22 22.6 22H25V9.2Z" fill="#C79A4B" />
                <rect x="15.2" y="7.2" width="1.6" height="16.4" fill="#18352B" />
              </svg>
              <span className="brand-text">
                <span className="brand-name">Biblioteca Escolar</span>
                <span className="brand-sub">Normal Superior Santa Clara Almaguer</span>
              </span>
            </a>
            <nav className="main-nav" aria-label="Navegación principal">
              <NavLinks pendientes={pendientes} />
            </nav>
            <div className="header-actions">
              <a href="/libros/nuevo" className="btn btn-primary nav-cta">
                Agregar libro
              </a>
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
