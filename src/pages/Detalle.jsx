import { useMemo, useState } from 'react';
import Poster from '../components/Poster';
import { PageTitle, QtyStepper, StateMessage, Stepper, Summary } from '../components/Common';
import { eventos } from '../data/events';
import { useTickets } from '../context/TicketContext';
import { dinero, disponibilidad } from '../utils/helpers';

export default function Detalle({ eventoId, navegar }) {
  const { estado, dispatch } = useTickets();
  const evento = eventos.find(item => item.id === eventoId);
  const [zonaId, setZonaId] = useState(evento?.zonas[0].id || 'general');
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const zona = useMemo(() => evento?.zonas.find(item => item.id === zonaId), [evento, zonaId]);
  if (!evento) return <main className="container"><PageTitle titulo="Evento no encontrado" /><button className="btn" onClick={() => navegar('explorar')}>Volver a eventos</button></main>;
  const estadoEvento = estado.eventosEstado[evento.id] || evento.estado;
  const disponibles = disponibilidad(evento, zona, estado.ordenes, estado.inventarioAjustes);
  const enCarrito = estado.carrito.filter(item => item.eventoId === evento.id && item.zonaId === zona.id).reduce((suma, item) => suma + item.cantidad, 0);
  const cantidadMax = Math.min(8, disponibles - enCarrito);
  function agregar() {
    if (estadoEvento !== 'Disponible' || cantidad > cantidadMax || cantidadMax < 1) { setMensaje('No hay entradas suficientes en esta zona.'); return; }
    dispatch({ type: 'AGREGAR_CARRITO', item: { eventoId: evento.id, zonaId, cantidad, precio: zona.precio } });
    navegar('carrito');
  }
  return <main className="container inner-page">
    <div className="breadcrumbs"><button type="button" onClick={() => navegar('explorar')}>Explorar eventos</button><span>/</span><span>{evento.nombre}</span></div>
    <Stepper actual={1}/>
    <div className="detail-layout">
      <div className="detail-content"><Poster evento={evento} grande /><p className="eyebrow detail-eyebrow">{evento.categoria} · El Salvador</p><h1>{evento.nombre}</h1><p className="muted large-text">{evento.descripcion}</p><div className="info-list"><div><span>Fecha</span><strong>{evento.fechaTexto} · 2027</strong></div><div><span>Lugar</span><strong>{evento.lugar}, {evento.ciudad}</strong></div><div><span>Estado</span><strong>{estadoEvento}</strong></div></div></div>
      <aside className="purchase-panel"><h2>Seleccioná tus entradas</h2><p className="muted">Elegí una zona para continuar con tu compra.</p><div className="zone-list">{evento.zonas.map(item => { const libres = disponibilidad(evento, item, estado.ordenes, estado.inventarioAjustes); return <button type="button" className={`zone-option ${zonaId === item.id ? 'selected' : ''}`} key={item.id} onClick={() => { setZonaId(item.id); setCantidad(1); setMensaje(''); }} aria-pressed={zonaId === item.id}><span><strong>{item.nombre}</strong><small>{libres} disponibles</small></span><b>{dinero(item.precio)}</b></button>; })}</div><div className="quantity-row"><span>Cantidad</span><QtyStepper valor={Math.min(cantidad, Math.max(1, cantidadMax))} onChange={setCantidad} min={1} max={Math.max(1,cantidadMax)} /></div><Summary lineas={[{ nombre: `${zona.nombre} · ${Math.min(cantidad, Math.max(1,cantidadMax))} entrada(s)`, valor: zona.precio * Math.min(cantidad, Math.max(1,cantidadMax)) }]} total={zona.precio * Math.min(cantidad, Math.max(1,cantidadMax))} titulo="Tu selección"/>{mensaje && <StateMessage tipo="error">{mensaje}</StateMessage>}<button type="button" className="btn btn-dark btn-full" disabled={estadoEvento !== 'Disponible' || cantidadMax < 1} onClick={agregar}>Agregar al carrito ↗</button><p className="microcopy">Pago simulado. No se realiza ningún cobro.</p></aside>
    </div>
  </main>;
}
