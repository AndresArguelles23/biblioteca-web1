import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn(
    'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Revisa el archivo .env.local o las variables de entorno en Vercel.'
  );
}

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder-key'
);

/**
 * Supabase/PostgREST solo devuelve 1000 filas por consulta por defecto.
 * Con un inventario de miles de libros, un .select() normal se queda corto
 * (por ejemplo, el listado de categorías quedaba incompleto). Esta función
 * pagina automáticamente hasta traer todas las filas.
 */
export async function fetchAllRows(columns, applyFilters) {
  const pageSize = 1000;
  let all = [];
  let from = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = supabase.from('libros').select(columns).range(from, from + pageSize - 1);
    if (applyFilters) query = applyFilters(query);
    const { data, error } = await query;
    if (error) throw error;
    all = all.concat(data || []);
    if (!data || data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}
