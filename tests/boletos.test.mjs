import test from 'node:test';
import assert from 'node:assert/strict';
import { codigoBoleto, verificarBoleto } from '../src/utils/tickets.js';
const ordenes = [{ id: 'TE-123', estado: 'confirmada', items: [{ eventoId: 'nocturna', zonaId: 'vip', cantidad: 2, precio: 85 }] }];
const eventos = [{ id:'nocturna', nombre:'Nocturna Sessions', zonas:[{id:'vip',nombre:'VIP'}] }];

test('QR: cada entrada tiene un identificador unico', () => {
  assert.notEqual(codigoBoleto('TE-123','nocturna','vip',1), codigoBoleto('TE-123','nocturna','vip',2));
});

test('QR: verifica una orden local y rechaza codigos inventados', () => {
  const ok = verificarBoleto(codigoBoleto('TE-123','nocturna','vip',2), ordenes, eventos);
  assert.equal(ok.valido, true);
  assert.equal(ok.evento, 'Nocturna Sessions');
  assert.equal(verificarBoleto('TE|TE-123|nocturna|vip|3', ordenes, eventos).valido, false);
  assert.equal(verificarBoleto('TE|TE-999|nocturna|vip|1', ordenes, eventos).valido, false);
  assert.equal(verificarBoleto('INVALIDO', ordenes, eventos).valido, false);
});
