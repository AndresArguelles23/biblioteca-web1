import { redirect } from 'next/navigation';

// El inventario ahora vive en "/". Esta ruta se conserva solo para no
// romper enlaces o marcadores antiguos.
export default function InventarioRedirect({ searchParams }) {
  const usp = new URLSearchParams(searchParams || {});
  const s = usp.toString();
  redirect(s ? `/?${s}` : '/');
}
