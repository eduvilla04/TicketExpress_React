export function pausa(ms = 300, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Petición cancelada', 'AbortError'));
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', cancelar);
      resolve();
    }, ms);
    function cancelar() {
      clearTimeout(timer);
      reject(new DOMException('Petición cancelada', 'AbortError'));
    }
    signal?.addEventListener('abort', cancelar, { once: true });
  });
}

export async function obtenerJSON(ruta, { signal } = {}) {
  const base = import.meta.env?.BASE_URL || '/';
  const url = `${base}data/${ruta}`;
  const respuesta = await fetch(url, { signal });
  if (!respuesta.ok) throw new Error(`No se pudieron cargar los datos (${respuesta.status}).`);
  return respuesta.json();
}

export function leerAlmacen(clave, inicial) {
  try { return JSON.parse(localStorage.getItem(clave)) ?? inicial; }
  catch { return inicial; }
}

export function guardarAlmacen(clave, datos) {
  try { localStorage.setItem(clave, JSON.stringify(datos)); }
  catch { throw new Error('El navegador no permitió guardar los cambios.'); }
}
