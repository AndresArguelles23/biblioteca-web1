import { Manrope, Inter, IBM_Plex_Mono } from 'next/font/google';
import { isAuthenticated } from '@/lib/auth';
import { logout } from '@/app/login/actions';
import { supabase } from '@/lib/supabase';
import NavLinks from '@/components/NavLinks';
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
          <a href="/" style={{ textDecoration: 'none' }}>
            <div className="brand-mark">
              <div className="brand-icon">BE</div>
              <div>
                <h1>Biblioteca Escolar</h1>
                <div className="subtitle">Normal Superior Santa Clara Almaguer</div>
              </div>
            </div>
          </a>
          <nav className="main-nav" aria-label="Navegación principal">
            <NavLinks pendientes={pendientes} />
            <a href="/libros/nuevo" className="btn btn-primary nav-cta">
              + Agregar libro
            </a>
            {authed ? (
              <form action={logout} className="nav-session">
                <button type="submit" className="btn btn-outline">
                  Cerrar sesión
                </button>
              </form>
            ) : (
              <a href="/login" className="btn btn-outline nav-session">
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
