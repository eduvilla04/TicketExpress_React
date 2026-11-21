import { useState } from 'react';
import { eventos, categorias } from '../data/events';
import { useTickets } from '../context/TicketContext';
import { textoSeguro } from '../utils/helpers';
import EventCard from '../components/EventCard';
import { PageTitle, EmptyState, FilterTabs } from '../components/Common';

export default function Inicio({ navegar }) {
  const { estado } = useTickets();
  const [categoria, setCategoria] = useState('Todos');
  const lista = eventos.filter(evento =>
    (categoria === 'Todos' || evento.categoria === categoria) &&
    (estado.ciudad === 'Todo El Salvador' || evento.ciudad === estado.ciudad || (estado.ciudad === 'San Salvador' && textoSeguro(evento.ciudad) === 'santa tecla'))
  );
  return <main className="container home-page">
    <PageTitle titulo="Descubrí experiencias" descripcion="Conciertos, cultura y momentos que vale la pena vivir." />
    <section aria-labelledby="lista-titulo">
      <div className="home-toolbar"><h2 id="lista-titulo"><button type="button" className="text-link" onClick={() => setCategoria('Todos')}>Todos los eventos</button></h2><FilterTabs valor={categoria} opciones={categorias.slice(1)} onChange={valor => setCategoria(valor === categoria ? 'Todos' : valor)} /></div>
      {lista.length ? <div className="events-grid">{lista.map(evento => <EventCard key={evento.id} evento={evento} onOpen={id => navegar('detalle', { eventoId: id })} estado={estado.eventosEstado[evento.id] || evento.estado}/>)}</div> : <EmptyState titulo="No hay eventos" descripcion="Probá con otra ciudad o categoría." accion={() => setCategoria('Todos')} textoAccion="Ver todos" />}
      <div className="home-more"><button type="button" className="btn btn-outline" onClick={() => navegar('explorar')}>Explorar todos los eventos ↗</button></div>
    </section>
  </main>;
}
