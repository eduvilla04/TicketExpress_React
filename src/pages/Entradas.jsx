import { useTickets } from '../context/TicketContext';
import { useCatalogo } from '../providers/EventProvider';
import { dinero } from '../utils/helpers';
import { EmptyState, PageTitle, Stepper, StateMessage } from '../components/Common';
import TicketQR from '../components/TicketQR';
import { codigoBoleto } from '../utils/tickets';

export function Confirmacion({ ordenId, navegar }) {
  const { estado } = useTickets();
  const orden = estado.ordenes.find(o => o.id === ordenId);
  if (!orden) return <main className="container inner-page"><PageTitle titulo="Compra no encontrada"/><button className="btn" onClick={() => navegar('entradas')}>Mis entradas</button></main>;
  return <main className="container inner-page confirmation-page">
    <Stepper actual={4}/>
    <div className="confirmation-head">
      <span className="success-icon">✓</span>
      <p className="eyebrow">COMPRA CONFIRMADA</p>
      <h1>¡Tus entradas están listas!</h1>
      <p className="muted">Tu compra de demostración se completó. No se realizó ningún cobro.</p>
      <p className="confirmation-code">Orden: <strong>{orden.id}</strong></p>
      <StateMessage tipo="success">Confirmación de correo simulada. No se enviaron mensajes reales.</StateMessage>
    </div>
    <div className="confirmation-actions">
      <button className="btn btn-dark" onClick={() => navegar('entradas')}>Ver mis entradas ↗</button>
      <button className="btn btn-outline" onClick={() => navegar('explorar')}>Explorar otros eventos</button>
    </div>
  </main>;
}

export default function Entradas({ navegar }) {
  const { estado } = useTickets();
  const { eventos } = useCatalogo();
  const ordenes = estado.ordenes.filter(orden => !orden.compradorCorreo || orden.compradorCorreo === estado.sesion?.correo || estado.sesion?.rol === 'administrador');
  return <main className="container inner-page">
    <PageTitle etiqueta="TUS BOLETOS" titulo="Mis entradas" descripcion="Entradas de demostración generadas en este navegador."/>
    {ordenes.length ? <div className="tickets-list">{ordenes.map(orden => (
      <section className="panel" key={orden.id}>
        <div className="panel-head"><h2>Orden {orden.id}</h2><span className="muted small-text">{new Date(orden.fecha).toLocaleDateString('es-SV')}</span></div>
        {orden.items.flatMap(item => Array.from({ length: item.cantidad }, (_, index) => {
          const evento = eventos.find(e => e.id === item.eventoId);
          const zona = evento?.zonas.find(z => z.id === item.zonaId);
          const codigo = codigoBoleto(orden.id, item.eventoId, item.zonaId, index + 1);
          return <article key={codigo} className="ticket-item">
            <div>
              <p className="eyebrow">TICKETEXPRESS · ENTRADA DEMO</p>
              <h3>{evento?.nombre || item.eventoId}</h3>
              <p>{evento?.fechaTexto || 'Fecha de muestra'} · {evento?.lugar || 'Lugar no disponible'}</p>
              <p className="muted">{zona?.nombre || item.zonaId} · Boleto {index + 1} de {item.cantidad}</p>
              <strong>{dinero(item.precio)}</strong>
              <p className="ticket-code">Código: {codigo}</p>
            </div>
            <TicketQR codigo={codigo}/>
          </article>;
        }))}
      </section>
    ))}</div> : <EmptyState titulo="Todavía no tenés entradas" descripcion="Completá una compra simulada para ver tus boletos." accion={() => navegar('explorar')} textoAccion="Explorar eventos" />}
  </main>;
}
