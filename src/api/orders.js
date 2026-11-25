import { pausa } from './base.js';
import { soloDigitos, validarCorreo, idCompra } from '../utils/helpers.js';

export async function confirmarPago({ formulario, items, eventos, ordenes, usuario }) {
  const { nombre, correo, tarjeta, vencimiento, cvv } = formulario;
  if (nombre.trim().length < 3 || !validarCorreo(correo)) throw new Error('Revisá el nombre y el correo de demostración.');
  const numero = soloDigitos(tarjeta);
  if (numero.length !== 16 || !/^\d{2}\/\d{2}$/.test(vencimiento) || soloDigitos(cvv).length !== 3) {
    throw new Error('Completá los datos ficticios de la tarjeta (16 dígitos, MM/AA y CVV).');
  }
  if (!items.length) throw new Error('El carrito está vacío.');
  for (const item of items) {
    const evento = eventos.find(e => e.id === item.eventoId);
    const zona = evento?.zonas.find(z => z.id === item.zonaId);
    const vendidas = ordenes.flatMap(o => o.items).filter(i => i.eventoId === evento?.id && i.zonaId === zona?.id).reduce((suma, i) => suma + i.cantidad, 0);
    if (!zona || evento.estado !== 'Disponible' || zona.capacidad - vendidas < item.cantidad) {
      throw new Error('Cambió la disponibilidad. Revisá el carrito antes de continuar.');
    }
    if (item.precio !== zona.precio) {
      throw new Error('El precio de una zona cambió. Quitá esa entrada del carrito y volvé a agregarla.');
    }
  }
  await pausa(850);
  if (numero.endsWith('0000')) throw new Error('Pago simulado rechazado. Probá con 4242 4242 4242 4242.');
  return {
    id: idCompra(), fecha: new Date().toISOString(),
    comprador: usuario?.nombre || 'Cliente demo',
    compradorCorreo: usuario?.correo || 'invitado@ticketexpress.test',
    estado: 'confirmada',
    total: items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
    items: items.map(item => ({ ...item }))
  };
}
