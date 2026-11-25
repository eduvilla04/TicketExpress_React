export function calcularReporte(ordenes, eventos, dias = 0) {
  const limite = dias ? Date.now() - dias*24*60*60*1000 : 0;
  const filtradas = ordenes.filter(o => !limite || new Date(o.fecha).getTime() >= limite);
  const acumulados = new Map();
  for (const orden of filtradas) {
    for (const item of orden.items) {
      const actual = acumulados.get(item.eventoId) || { eventoId:item.eventoId, monto:0, boletos:0 };
      actual.monto += item.precio*item.cantidad;
      actual.boletos += item.cantidad;
      acumulados.set(item.eventoId,actual);
    }
  }
  const filas=[...acumulados.values()].map(d=>({...d,evento:eventos.find(e=>e.id===d.eventoId)?.nombre||d.eventoId})).sort((a,b)=>b.monto-a.monto);
  return {filas, ordenes:filtradas.length, monto:filas.reduce((s,d)=>s+d.monto,0), boletos:filas.reduce((s,d)=>s+d.boletos,0)};
}

