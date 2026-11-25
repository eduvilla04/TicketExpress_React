import test from 'node:test';
import assert from 'node:assert/strict';
import { eventos as fixture } from '../src/data/events.js';
import { listarEventos, buscarEvento, crearEvento, editarEvento, actualizarZona, eliminarEvento } from '../src/api/events.js';
import { cuentasDemo, iniciarSesion } from '../src/api/users.js';
import { confirmarPago } from '../src/api/orders.js';
import { calcularReporte } from '../src/utils/reports.js';
import QRCode from '../src/vendor/qr/index.js';
import Nivel from '../src/vendor/qr/QRErrorCorrectLevel.js';

const memoria = new Map();
globalThis.localStorage = {
  getItem: clave => memoria.get(clave) ?? null,
  setItem: (clave, valor) => memoria.set(clave, String(valor)),
  removeItem: clave => memoria.delete(clave)
};
globalThis.fetch = async (url, options) => {
  if (options?.signal?.aborted) throw new DOMException('Cancelada', 'AbortError');
  if (url.includes('events.json')) return { ok: true, json: async () => structuredClone(fixture) };
  return { ok: false, status: 404 };
};

test('API falsa: lee, crea, edita, ajusta zona y elimina', async () => {
  assert.equal((await listarEventos()).length, 8);
  const creado = await crearEvento({ nombre: 'Evento nuevo', lugar: 'Teatro', ciudad: 'San Salvador', categoria: 'Teatro', fecha: '2027-11-30', zonas: [{ id: 'general', nombre: 'General', precio: 12, capacidad: 80 }] });
  assert.ok((await buscarEvento(creado.id)));
  await editarEvento(creado.id, { estado: 'Pausado' });
  assert.equal((await buscarEvento(creado.id)).estado, 'Pausado');
  await actualizarZona(creado.id, 'general', { precio: 25, capacidad: 70 });
  assert.equal((await buscarEvento(creado.id)).zonas[0].precio, 25);
  await eliminarEvento(creado.id);
  assert.equal(await buscarEvento(creado.id), null);
  assert.equal((await listarEventos()).length, 8);
});

test('API de sesión: tres roles y credenciales de prueba', async () => {
  assert.deepEqual(cuentasDemo.map(u => u.rol), ['cliente','administrador','organizador']);
  const usuario = await iniciarSesion({ correo: 'admin@ticketexpress.test', clave: 'Demo123!' });
  assert.equal(usuario.rol, 'administrador');
  assert.equal('clave' in usuario, false);
  await assert.rejects(() => iniciarSesion({ correo: usuario.correo, clave: 'incorrecta' }));
});

test('API de pago: genera orden y rechaza tarjeta simulada', async () => {
  const item = { eventoId: fixture[0].id, zonaId: 'general', cantidad: 2, precio: 35 };
  const formulario = { nombre: 'Cliente prueba', correo: 'demo@ejemplo.test', tarjeta: '4242 4242 4242 4242', vencimiento: '12/29', cvv: '123' };
  const orden = await confirmarPago({ formulario, items: [item], eventos: fixture, ordenes: [] });
  assert.equal(orden.total, 70);
  assert.equal(orden.estado, 'confirmada');
  assert.equal(orden.items[0].cantidad, 2);
  assert.equal(JSON.stringify(orden).includes('4242'), false);
  await assert.rejects(() => confirmarPago({ formulario: {...formulario, tarjeta: '4242 4242 4242 0000'}, items: [item], eventos: fixture, ordenes: [] }));
});

test('Reportes: suman órdenes reales y separan eventos', () => {
  const ordenes=[{fecha:new Date().toISOString(),items:[{eventoId:'nocturna',zonaId:'general',precio:35,cantidad:2},{eventoId:'jazz',zonaId:'general',precio:28,cantidad:1}]}];
  const reporte=calcularReporte(ordenes,fixture);
  assert.equal(reporte.monto,98);
  assert.equal(reporte.boletos,3);
  assert.equal(reporte.filas.length,2);
});

test('QR: genera una matriz real con corrector de errores', () => {
  const qr = new QRCode(0,Nivel.M);
  qr.addData('TE|TE-PRUEBA|nocturna|general|1');
  qr.make();
  assert.ok(qr.getModuleCount()>=21);
  assert.equal(qr.isDark(0,0),true);
});
