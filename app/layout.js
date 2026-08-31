import { Manrope, Inter, IBM_Plex_Mono } from 'next/font/google';
import { supabase } from '@/lib/supabase';
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
};

async function getRevisarCount() {
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
  const revisarCount = await getRevisarCount();

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
            <a href="/revisar">
              Revisar
              {revisarCount > 0 && <span className="nav-count">{revisarCount}</span>}
            </a>
            <a href="/libros/nuevo" className="btn btn-primary" style={{ marginLeft: 8 }}>
              + Agregar libro
            </a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
