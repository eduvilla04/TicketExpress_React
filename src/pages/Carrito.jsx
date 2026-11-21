import { eventos } from '../data/events';
import { useTickets } from '../context/TicketContext';
import { dinero, disponibilidad } from '../utils/helpers';
import { EmptyState, PageTitle, QtyStepper, Stepper, Summary } from '../components/Common';

export default function Carrito({ navegar }) {
  const { estado, dispatch } = useTickets();
  const items = estado.carrito
    .map(item => ({ ...item, evento: eventos.find(e => e.id === item.eventoId) }))
    .filter(item => item.evento);
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  const lineas = items.map(item => ({
    nombre: `${item.evento.nombre} · ${item.cantidad}`,
    valor: item.precio * item.cantidad
  }));

  return (
    <main className="container inner-page">
      <PageTitle
        etiqueta="TU COMPRA"
        titulo="Tu carrito"
        descripcion="Revisá las entradas antes de continuar."
      />
      <Stepper actual={2} />

      {items.length ? (
        <div className="cart-layout">
          <section className="panel">
            <h2>Entradas seleccionadas</h2>
            {items.map(item => {
              const zona = item.evento.zonas.find(z => z.id === item.zonaId);
              const libres = disponibilidad(item.evento, zona, estado.ordenes, estado.inventarioAjustes);
              const limite = Math.max(1, Math.min(8, libres));

              return (
                <article className="cart-item" key={`${item.eventoId}:${item.zonaId}`}>
                  <div>
                    <p className="eyebrow">{item.evento.categoria}</p>
                    <h3>{item.evento.nombre}</h3>
                    <p className="muted small-text">{zona.nombre} · {item.evento.fechaTexto}</p>
                    <button
                      type="button"
                      className="subtle-link"
                      onClick={() => dispatch({
                        type: 'QUITAR_CARRITO',
                        eventoId: item.eventoId,
                        zonaId: item.zonaId
                      })}
                    >
                      Quitar
                    </button>
                  </div>
                  <div className="cart-item-right">
                    <QtyStepper
                      valor={item.cantidad}
                      onChange={cantidad => dispatch({
                        type: 'CAMBIAR_CANTIDAD',
                        eventoId: item.eventoId,
                        zonaId: item.zonaId,
                        cantidad
                      })}
                      max={limite}
                    />
                    <strong>{dinero(item.precio * item.cantidad)}</strong>
                  </div>
                </article>
              );
            })}
          </section>
          <div>
            <Summary lineas={lineas} total={total} />
            <button className="btn btn-dark btn-full" onClick={() => navegar('pago')}>
              Continuar al pago ↗
            </button>
            <button className="btn btn-outline btn-full top-gap" onClick={() => navegar('explorar')}>
              Seguir explorando
            </button>
          </div>
        </div>
      ) : (
        <EmptyState
          titulo="Tu carrito está vacío"
          descripcion="Elegí un evento y agregá tus entradas."
          accion={() => navegar('explorar')}
          textoAccion="Explorar eventos"
        />
      )}
    </main>
  );
}
