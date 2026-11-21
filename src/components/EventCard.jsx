import Poster from './Poster';
import { dinero } from '../utils/helpers';

export default function EventCard({ evento, onOpen, estado = 'Disponible' }) {
  return <article className="event-card">
    <button type="button" className="card-link" onClick={() => onOpen(evento.id)} aria-label={`Ver detalles de ${evento.nombre}`}>
      <Poster evento={evento} />
      <div className="event-details">
        <p className="event-meta">{evento.categoria} · El Salvador</p>
        <h3>{evento.nombre}</h3>
        <p className="event-date">{evento.fechaTexto}</p>
        <p className="event-venue">{evento.lugar} · {evento.ciudad}</p>
        <div className="event-card-last"><span className="event-price">Desde {dinero(evento.precioDesde)}</span>{estado !== 'Disponible' && <span className="status-dot">{estado}</span>}</div>
      </div>
    </button>
  </article>;
}
