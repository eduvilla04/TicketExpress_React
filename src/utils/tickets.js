export function codigoBoleto(ordenId, eventoId, zonaId, numero) {
  return `TE|${ordenId}|${eventoId}|${zonaId}|${numero}`;
}

export function verificarBoleto(codigo, ordenes, eventos) {
  const partes = String(codigo || '').trim().split('|');
  if (partes.length !== 5 || partes[0] !== 'TE' || !/^[1-9]\d*$/.test(partes[4])) {
    return { valido: false, mensaje: 'El código no tiene el formato de TicketExpress.' };
  }
  const [, ordenId, eventoId, zonaId, numero] = partes;
  const orden = ordenes.find(item => item.id === ordenId && item.estado !== 'cancelada');
  if (!orden) return { valido: false, mensaje: 'No se encontró una compra confirmada para este código.' };
  const entrada = orden.items.find(item => item.eventoId === eventoId && item.zonaId === zonaId);
  if (!entrada || Number(numero) > entrada.cantidad) {
    return { valido: false, mensaje: 'Este boleto no pertenece a la orden indicada.' };
  }
  const evento = eventos.find(item => item.id === eventoId);
  return {
    valido: true,
    mensaje: 'El boleto corresponde a una orden de demostración.',
    ordenId,
    boleto: Number(numero),
    evento: evento?.nombre || eventoId,
    zona: evento?.zonas.find(z => z.id === zonaId)?.nombre || zonaId
  };
}
