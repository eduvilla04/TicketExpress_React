import { useTickets } from '../context/TicketContext';
import { eventos } from '../data/events';
import { dinero } from '../utils/helpers';
import { EmptyState, PageTitle, Stepper } from '../components/Common';
import TicketQR from '../components/TicketQR';

export function Confirmacion({ ordenId, navegar }) {
  const { estado } = useTickets();
  const orden = estado.ordenes.find(o => o.id === ordenId);
  if (!orden) return <main className="container inner-page"><PageTitle titulo="Compra no encontrada"/><button className="btn" onClick={() => navegar('entradas')}>Mis entradas</button></main>;
  return <main className="container inner-page confirmation-page"><Stepper actual={4}/><div className="confirmation-head"><span className="success-icon">✓</span><p className="eyebrow">COMPRA CONFIRMADA</p><h1>¡Tus entradas están listas!</h1><p className="muted">Tu compra de demostración se completó correctamente. No se realizó ningún cobro.</p><p className="confirmation-code">Número de orden: <strong>{orden.id}</strong></p></div><div className="confirmation-actions"><button className="btn btn-dark" onClick={() => navegar('entradas')}>Ver mis entradas ↗</button><button className="btn btn-outline" onClick={() => navegar('explorar')}>Explorar otros eventos</button></div></main>;
}

export default function Entradas({ navegar }) {
  const { estado } = useTickets();
  return <main className="container inner-page"><PageTitle etiqueta="TUS BOLETOS" titulo="Mis entradas" descripcion="Entradas generadas en este navegador para la demostración."/>
    {estado.ordenes.length ? <div className="tickets-list">{estado.ordenes.map(orden => <section className="panel" key={orden.id}><div className="panel-head"><h2>Orden {orden.id}</h2><span className="muted small-text">{new Date(orden.fecha).toLocaleDateString('es-SV')}</span></div>{orden.items.map(item => { const evento = eventos.find(ev => ev.id === item.eventoId); const zona = evento?.zonas.find(z => z.id === item.zonaId); return <article key={`${item.eventoId}:${item.zonaId}`} className="ticket-item"><div><p className="eyebrow">TICKETEXPRESS · DEMO</p><h3>{evento?.nombre}</h3><p>{evento?.fechaTexto} · {evento?.lugar}</p><p className="muted">{zona?.nombre} · {item.cantidad} boleto{item.cantidad > 1 ? 's' : ''}</p><strong>{dinero(item.precio * item.cantidad)}</strong></div><TicketQR codigo={`${orden.id}-${item.eventoId}-${item.zonaId}`}/></article>; })}</section>)}</div> : <EmptyState titulo="Todavía no tenés entradas" descripcion="Cuando completés una compra simulada, tus boletos aparecerán aquí." accion={() => navegar('explorar')} textoAccion="Explorar eventos" />}
  </main>;
}
