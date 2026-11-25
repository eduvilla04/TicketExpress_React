import { obtenerJSON, pausa, leerAlmacen, guardarAlmacen } from './base.js';

const CLAVE = 'ticketexpress_api_eventos_v3';
const vacio = { creados: [], editados: {}, eliminados: [] };
const cambios = () => leerAlmacen(CLAVE, vacio);

function combinar(base, cambiosLocales) {
  return [...base, ...(cambiosLocales.creados || [])]
    .filter(evento => !(cambiosLocales.eliminados || []).includes(evento.id))
    .map(evento => ({ ...evento, ...(cambiosLocales.editados?.[evento.id] || {}) }));
}

export async function listarEventos({ signal } = {}) {
  await pausa(220, signal);
  const base = await obtenerJSON('events.json', { signal });
  return combinar(base, cambios());
}

export async function buscarEvento(id, { signal } = {}) {
  const eventos = await listarEventos({ signal });
  return eventos.find(evento => evento.id === id) || null;
}

function validarEvento(evento) {
  if (!evento.nombre?.trim() || !evento.lugar?.trim() || !evento.ciudad?.trim()) {
    throw new Error('Completá el nombre, el lugar y la ciudad.');
  }
  if (!evento.zonas?.length || evento.zonas.some(zona => !Number.isFinite(zona.precio) || zona.precio < 0 || !Number.isInteger(zona.capacidad) || zona.capacidad < 0)) {
    throw new Error('Revisá los precios y la capacidad de las zonas.');
  }
}

export async function crearEvento(datos) {
  await pausa(350);
  const evento = {
    ...datos,
    id: `evento-${Date.now().toString(36)}-${Math.floor(Math.random() * 10000)}`,
    nombre: datos.nombre.trim(),
    lugar: datos.lugar.trim(),
    ciudad: datos.ciudad.trim(),
    poster: datos.poster || 'nocturna',
    tituloPoster: datos.tituloPoster || datos.nombre.toUpperCase(),
    detallePoster: datos.detallePoster || 'TICKETEXPRESS',
    estado: datos.estado || 'Disponible'
  };
  validarEvento(evento);
  const local = cambios();
  local.creados = [...(local.creados || []), evento];
  guardarAlmacen(CLAVE, local);
  return evento;
}

export async function editarEvento(id, datos) {
  await pausa(300);
  const anterior = await buscarEvento(id);
  if (!anterior) throw new Error('El evento ya no existe.');
  const actualizado = { ...anterior, ...datos, id };
  validarEvento(actualizado);
  const local = cambios();
  local.editados = { ...(local.editados || {}), [id]: actualizado };
  guardarAlmacen(CLAVE, local);
  return actualizado;
}

export async function eliminarEvento(id) {
  await pausa(300);
  const local = cambios();
  local.eliminados = [...new Set([...(local.eliminados || []), id])];
  guardarAlmacen(CLAVE, local);
  return { id, eliminado: true };
}

export async function actualizarZona(id, zonaId, { precio, capacidad }) {
  const evento = await buscarEvento(id);
  if (!evento) throw new Error('El evento no existe.');
  if (!evento.zonas.some(zona => zona.id === zonaId)) throw new Error('La zona no existe.');
  const zonas = evento.zonas.map(zona => zona.id === zonaId
    ? { ...zona, precio: Number(precio), capacidad: Number(capacidad) }
    : zona);
  return editarEvento(id, { zonas, precioDesde: Math.min(...zonas.map(zona => zona.precio)) });
}

export function reiniciarEventosDemo() {
  localStorage.removeItem(CLAVE);
}
