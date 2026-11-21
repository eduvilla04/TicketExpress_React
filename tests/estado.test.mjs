import test from 'node:test';
import assert from 'node:assert/strict';
import { eventos, categorias } from '../src/data/events.js';
import { inicial, reducer } from '../src/context/ticketReducer.js';
import { disponibilidad, dinero, validarCorreo, textoSeguro } from '../src/utils/helpers.js';

test('catalogo: ocho eventos y tres zonas por cada uno', () => {
  assert.equal(eventos.length, 8);
  for (const evento of eventos) {
    assert.equal(evento.zonas.length, 3);
    assert.ok(evento.zonas.every(zona => zona.capacidad > 0 && zona.precio >= 0));
    assert.ok(categorias.includes(evento.categoria));
  }
});

test('carrito: agrega, suma y elimina elementos', () => {
  const item = { eventoId: 'nocturna', zonaId: 'general', precio: 35, cantidad: 1 };
  let estado = reducer(inicial, { type: 'AGREGAR_CARRITO', item });
  estado = reducer(estado, { type: 'AGREGAR_CARRITO', item: { ...item, cantidad: 2 } });
  assert.equal(estado.carrito.length, 1);
  assert.equal(estado.carrito[0].cantidad, 3);
  estado = reducer(estado, { type: 'CAMBIAR_CANTIDAD', eventoId: 'nocturna', zonaId: 'general', cantidad: 2 });
  assert.equal(estado.carrito[0].cantidad, 2);
  estado = reducer(estado, { type: 'QUITAR_CARRITO', eventoId: 'nocturna', zonaId: 'general' });
  assert.equal(estado.carrito.length, 0);
});

test('compra: guarda orden y limpia carrito sin alterar historial', () => {
  const item = { eventoId: 'jazz', zonaId: 'general', precio: 28, cantidad: 2 };
  const conCarrito = reducer(inicial, { type: 'AGREGAR_CARRITO', item });
  const comprado = reducer(conCarrito, { type: 'COMPRAR', orden: { id: 'TE-TEST', items: [item], total: 56 } });
  assert.equal(comprado.carrito.length, 0);
  assert.equal(comprado.ordenes.length, 1);
  assert.equal(comprado.ordenes[0].total, 56);
});

test('disponibilidad descuenta boletos y permite ajustes de capacidad', () => {
  const evento = eventos[0], zona = evento.zonas[0];
  const ordenes = [{ items: [{ eventoId: evento.id, zonaId: zona.id, cantidad: 3 }] }];
  assert.equal(disponibilidad(evento,zona,ordenes), zona.capacidad - 3);
  assert.equal(disponibilidad(evento,zona,ordenes,{ [`${evento.id}:${zona.id}`]: 2 }), 0);
});

test('helpers: formatos y busqueda', () => {
  assert.equal(dinero(35), '$35.00');
  assert.equal(validarCorreo('demo@ejemplo.com'), true);
  assert.equal(validarCorreo('correo-malo'), false);
  assert.equal(textoSeguro('Música'), 'musica');
});
