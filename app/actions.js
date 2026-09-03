'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function toIntOrNull(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}

function toTextOrNull(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  return s === '' ? null : s;
}

function extractPayload(formData) {
  const revisar = formData.get('revisar') === 'on';
  return {
    categoria: toTextOrNull(formData.get('categoria')),
    subcategoria: toTextOrNull(formData.get('subcategoria')),
    clase: toTextOrNull(formData.get('clase')),
    autor: toTextOrNull(formData.get('autor')),
    titulo: toTextOrNull(formData.get('titulo')),
    edicion: toIntOrNull(formData.get('edicion')),
    ciudad: toTextOrNull(formData.get('ciudad')),
    anio: toIntOrNull(formData.get('anio')),
    editorial: toTextOrNull(formData.get('editorial')),
    pagina: toIntOrNull(formData.get('pagina')),
    ilustrador: toTextOrNull(formData.get('ilustrador')),
    isbn: toTextOrNull(formData.get('isbn')),
    cantidad: toIntOrNull(formData.get('cantidad')) ?? 1,
    estado: toTextOrNull(formData.get('estado')),
    ubicacion: toTextOrNull(formData.get('ubicacion')),
    revisar,
    notas_revision: revisar ? toTextOrNull(formData.get('notas_revision')) : null,
    texto_original: toTextOrNull(formData.get('texto_original')),
  };
}

export async function addBook(formData) {
  const payload = extractPayload(formData);
  const { error } = await supabase.from('libros').insert(payload);
  if (error) {
    throw new Error('No se pudo guardar el libro: ' + error.message);
  }
  revalidatePath('/');
  revalidatePath('/inventario');
  redirect('/inventario');
}

export async function updateBook(id, formData) {
  const payload = extractPayload(formData);
  const { error } = await supabase.from('libros').update(payload).eq('id', id);
  if (error) {
    throw new Error('No se pudo actualizar el libro: ' + error.message);
  }
  revalidatePath('/');
  revalidatePath('/inventario');
  redirect('/inventario');
}

export async function reviewSave(id, formData) {
  const payload = extractPayload(formData);
  // En la cola de revisión, el checkbox "Marcar como revisado" decide si
  // el libro sale de la lista de pendientes o si se queda (por si faltó
  // información y se quiere completar después).
  payload.revisar = formData.get('marcar_revisado') !== 'on' ? true : false;
  if (payload.revisar) {
    payload.notas_revision = toTextOrNull(formData.get('notas_revision'));
  } else {
    payload.notas_revision = null;
  }
  const { error } = await supabase.from('libros').update(payload).eq('id', id);
  if (error) {
    throw new Error('No se pudo guardar el libro: ' + error.message);
  }
  revalidatePath('/');
  revalidatePath('/revisar');
  redirect('/revisar');
}

export async function deleteBook(id) {
  const { error } = await supabase.from('libros').delete().eq('id', id);
  if (error) {
    throw new Error('No se pudo eliminar el libro: ' + error.message);
  }
  revalidatePath('/');
  revalidatePath('/inventario');
  redirect('/inventario');
}
