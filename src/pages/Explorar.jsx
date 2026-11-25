import { useEffect, useMemo, useState } from 'react';
import EventCard from '../components/EventCard';
import { EmptyState, FilterTabs, Loading, PageTitle, StateMessage } from '../components/Common';
import { categorias } from '../data/events';
import { useCatalogo } from '../providers/EventProvider';
import { useTickets } from '../context/TicketContext';
import { textoSeguro } from '../utils/helpers';

export default function Explorar({ navegar, busquedaInicial = '' }) {
  const { estado } = useTickets();
  const { eventos, cargando: cargandoApi, error: errorApi, recargar } = useCatalogo();
  const [texto, setTexto] = useState(busquedaInicial);
  const [busqueda, setBusqueda] = useState(busquedaInicial);
  const [categoria, setCategoria] = useState('Todos');
  const [cargando, setCargando] = useState(false);
  useEffect(() => {
    setTexto(busquedaInicial); setBusqueda(busquedaInicial);
  }, [busquedaInicial]);
  useEffect(() => {
    setCargando(true);
    const reloj = setTimeout(() => setCargando(false), 350);
    return () => clearTimeout(reloj);
  }, [busqueda, categoria, estado.ciudad]);
  const encontrados = useMemo(() => eventos.filter(evento => {
    const coincideCategoria = categoria === 'Todos' || evento.categoria === categoria;
    const coincideCiudad = estado.ciudad === 'Todo El Salvador' || evento.ciudad === estado.ciudad || (estado.ciudad === 'San Salvador' && evento.ciudad === 'Santa Tecla');
    const frase = textoSeguro(`${evento.nombre} ${evento.lugar} ${evento.categoria} ${evento.ciudad}`);
    return coincideCategoria && coincideCiudad && frase.includes(textoSeguro(busqueda.trim()));
  }), [eventos, busqueda, categoria, estado.ciudad]);
  return <main className="container explore-page">
    <PageTitle titulo="Encontrá tu próximo evento" descripcion="Explorá la agenda según fecha, categoría o ubicación." />
    <form className="explore-form" role="search" onSubmit={e => { e.preventDefault(); setBusqueda(texto); }}>
      <div className="field explore-input"><label htmlFor="buscar-evento">Buscar</label><input id="buscar-evento" value={texto} onChange={e => setTexto(e.target.value)} placeholder="Artista, evento o lugar..." /></div>
      <button className="btn btn-dark" type="submit">Buscar</button>
    </form>
    <section className="explore-results" aria-labelledby="filtros-titulo">
      <h2 id="filtros-titulo">Filtros</h2><FilterTabs valor={categoria} opciones={categorias} onChange={setCategoria}/>
      <div className="section-rule" />
      <p className="muted result-caption">{encontrados.length} evento{encontrados.length === 1 ? '' : 's'} encontrado{encontrados.length === 1 ? '' : 's'}</p>
      {cargandoApi || cargando ? <Loading texto="Buscando eventos..." /> : errorApi ? <StateMessage tipo="error">{errorApi} <button onClick={() => recargar()}>Reintentar</button></StateMessage> : encontrados.length ? <div className="events-grid explore-grid">{encontrados.map(evento => <EventCard key={evento.id} evento={evento} onOpen={id => navegar('detalle', { eventoId: id })} estado={evento.estado}/>)}</div> : <EmptyState titulo="No encontramos eventos" descripcion="Probá con otra búsqueda o categoría." accion={() => { setTexto(''); setBusqueda(''); setCategoria('Todos'); }} textoAccion="Limpiar filtros" />}
    </section>
  </main>;
}
