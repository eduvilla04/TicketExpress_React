export const dinero = numero => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numero);
export const esperar = (ms = 650) => new Promise(resolve => setTimeout(resolve, ms));
export const soloDigitos = valor => valor.replace(/\D/g, '');
export const textoSeguro = valor => String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function validarCorreo(correo) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo); }
export function leerLocal(clave, valor) {
  try { const texto = localStorage.getItem(clave); return texto ? JSON.parse(texto) : valor; }
  catch { return valor; }
}
export function idCompra() { return `TE-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`; }
export function disponibilidad(evento, zona, ordenes, ajustes = {}) {
  let vendidas = 0;
  for (const orden of ordenes) for (const item of orden.items) if (item.eventoId === evento.id && item.zonaId === zona.id) vendidas += item.cantidad;
  const clave = `${evento.id}:${zona.id}`;
  return Math.max(0, (ajustes[clave] ?? zona.capacidad) - vendidas);
}
