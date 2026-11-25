import { useRef, useState } from 'react';
import { useCatalogo } from '../providers/EventProvider';
import { useTickets } from '../context/TicketContext';
import { confirmarPago } from '../api/orders';
import { dinero } from '../utils/helpers';
import { FormField, PageTitle, StateMessage, Stepper, Summary } from '../components/Common';

export default function Pago({ navegar }) {
  const { estado, dispatch } = useTickets();
  const { eventos, cargando } = useCatalogo();
  const [formulario, setFormulario] = useState({ nombre: '', correo: '', tarjeta: '', vencimiento: '', cvv: '' });
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);
  const bloqueado = useRef(false);
  const items = estado.carrito;
  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const actualizar = e => setFormulario(datos => ({ ...datos, [e.target.name]: e.target.value }));

  async function pagar(e) {
    e.preventDefault();
    if (bloqueado.current) return;
    bloqueado.current = true;
    setProcesando(true);
    setError('');
    try {
      const comprador = estado.sesion || { nombre: 'Cliente demo', correo: 'cliente@ticketexpress.test', rol: 'cliente' };
      const orden = await confirmarPago({ formulario, items, eventos, ordenes: estado.ordenes, usuario: comprador });
      dispatch({ type: 'COMPRAR', orden });
      if (!estado.sesion) dispatch({ type: 'SESION', usuario: comprador });
      navegar('confirmacion', { ordenId: orden.id });
    } catch (fallo) {
      setError(fallo.message || 'No se pudo completar la operación de prueba.');
    } finally {
      bloqueado.current = false;
      setProcesando(false);
    }
  }

  if (!items.length) return <main className="container inner-page"><PageTitle titulo="Pago simulado"/><StateMessage>El carrito está vacío o la compra ya terminó.</StateMessage><button className="btn btn-dark" onClick={() => navegar('explorar')}>Explorar eventos</button></main>;
  return <main className="container inner-page">
    <PageTitle etiqueta="PASO 3 DE 4" titulo="Pago simulado" descripcion="Usá únicamente datos de demostración."/>
    <Stepper actual={3}/>
    <div className="cart-layout">
      <form className="panel pay-form" onSubmit={pagar} noValidate>
        <h2>Datos de demostración</h2>
        <StateMessage>Es una simulación. No ingresés tarjetas reales ni información personal.</StateMessage>
        <div className="form-grid">
          <FormField id="nombre-pago" label="Nombre de prueba" name="nombre" value={formulario.nombre} onChange={actualizar} autoComplete="off" placeholder="Cliente de prueba" required/>
          <FormField id="correo-pago" label="Correo de prueba" name="correo" type="email" value={formulario.correo} onChange={actualizar} autoComplete="off" placeholder="demo@ejemplo.com" required/>
          <FormField id="tarjeta-pago" label="Tarjeta ficticia" name="tarjeta" inputMode="numeric" value={formulario.tarjeta} onChange={actualizar} autoComplete="off" placeholder="4242 4242 4242 4242" required/>
          <div className="two-fields">
            <FormField id="vencimiento-pago" label="Vencimiento" name="vencimiento" value={formulario.vencimiento} onChange={actualizar} autoComplete="off" placeholder="12/29" required/>
            <FormField id="cvv-pago" label="CVV de prueba" name="cvv" inputMode="numeric" value={formulario.cvv} onChange={actualizar} autoComplete="off" placeholder="123" required/>
          </div>
        </div>
        {error && <StateMessage tipo="error">{error}</StateMessage>}
        <button type="submit" className="btn btn-dark btn-full" disabled={procesando || cargando}>{procesando ? 'Procesando...' : `Confirmar compra · ${dinero(total)}`}</button>
        <p className="microcopy">Ejemplo: 4242 4242 4242 4242, 12/29 y 123. Tarjetas que terminan en 0000 simulan un error.</p>
      </form>
      <div>
        <Summary titulo="Resumen de compra" lineas={items.map(item => ({ nombre: `${eventos.find(e => e.id === item.eventoId)?.nombre || 'Evento'} · ${item.cantidad}`, valor: item.precio * item.cantidad }))} total={total}/>
        <button className="btn btn-outline btn-full top-gap" disabled={procesando} onClick={() => navegar('carrito')}>Volver al carrito</button>
      </div>
    </div>
  </main>;
}
