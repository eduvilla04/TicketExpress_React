import { useRef, useState } from 'react';
import { eventos } from '../data/events';
import { useTickets } from '../context/TicketContext';
import { dinero, disponibilidad, esperar, idCompra, soloDigitos, validarCorreo } from '../utils/helpers';
import { FormField, PageTitle, StateMessage, Stepper, Summary } from '../components/Common';

export default function Pago({ navegar }) {
  const { estado, dispatch } = useTickets();
  const [formulario, setFormulario] = useState({ nombre: '', correo: '', tarjeta: '', vencimiento: '', cvv: '' });
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);
  const procesandoRef = useRef(false);
  const items = estado.carrito;
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const actualizar = e => setFormulario(viejo => ({ ...viejo, [e.target.name]: e.target.value }));
  async function pagar(e) {
    e.preventDefault();
    if (procesandoRef.current) return;
    setError('');
    const { nombre, correo, tarjeta, vencimiento, cvv } = formulario;
    if (nombre.trim().length < 3 || !validarCorreo(correo)) { setError('Revisá el nombre y el correo de demostración.'); return; }
    const numero = soloDigitos(tarjeta);
    if (numero.length !== 16 || !/^\d{2}\/\d{2}$/.test(vencimiento) || soloDigitos(cvv).length !== 3) { setError('Completá los datos de la tarjeta ficticia (16 dígitos, MM/AA y 3 dígitos).'); return; }
    if (items.length === 0) { setError('El carrito está vacío.'); return; }
    for (const item of items) {
      const evento = eventos.find(ev => ev.id === item.eventoId);
      const zona = evento?.zonas.find(z => z.id === item.zonaId);
      if (!zona || (estado.eventosEstado[evento.id] || evento.estado) !== 'Disponible' || disponibilidad(evento, zona, estado.ordenes, estado.inventarioAjustes) < item.cantidad) { setError('La disponibilidad cambió. Revisá el carrito antes de continuar.'); return; }
    }
    procesandoRef.current = true;
    setProcesando(true);
    try {
      await esperar(850);
      if (numero.endsWith('0000')) throw new Error('Pago simulado rechazado. Probá con la tarjeta ficticia 4242 4242 4242 4242.');
      const orden = { id: idCompra(), fecha: new Date().toISOString(), comprador: estado.sesion?.nombre || 'Cliente demo', total, items: items.map(item => ({ ...item })) };
      dispatch({ type: 'COMPRAR', orden });
      navegar('confirmacion', { ordenId: orden.id });
    } catch (fallo) {
      setError(fallo.message || 'No se pudo completar el pago de prueba. Intentá de nuevo.');
    } finally { procesandoRef.current = false; setProcesando(false); }
  }
  if (!items.length) return <main className="container inner-page"><PageTitle titulo="Pago simulado"/><StateMessage>El carrito está vacío o la compra ya se completó.</StateMessage><button className="btn btn-dark" onClick={() => navegar('explorar')}>Explorar eventos</button></main>;
  return <main className="container inner-page"><PageTitle etiqueta="PASO 3 DE 4" titulo="Pago simulado" descripcion="Completá la información ficticia para confirmar tu compra."/><Stepper actual={3}/>
    <div className="cart-layout"><form onSubmit={pagar} noValidate className="panel pay-form"><h2>Datos de demostración</h2><StateMessage>Esta es una simulación. Usá datos ficticios; no ingresés tarjetas ni información personal real.</StateMessage><div className="form-grid"><FormField id="nombre-pago" label="Nombre de prueba" name="nombre" value={formulario.nombre} onChange={actualizar} autoComplete="off" placeholder="Cliente de prueba" required/><FormField id="correo-pago" label="Correo de prueba" name="correo" value={formulario.correo} onChange={actualizar} type="email" autoComplete="off" placeholder="demo@ejemplo.com" required/><FormField id="tarjeta-pago" label="Tarjeta ficticia" name="tarjeta" value={formulario.tarjeta} onChange={actualizar} inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" required/><div className="two-fields"><FormField id="vencimiento-pago" label="Vencimiento" name="vencimiento" value={formulario.vencimiento} onChange={actualizar} placeholder="12/29" autoComplete="off" required/><FormField id="cvv-pago" label="CVV de prueba" name="cvv" value={formulario.cvv} onChange={actualizar} placeholder="123" inputMode="numeric" autoComplete="off" required/></div></div>{error && <StateMessage tipo="error">{error}</StateMessage>}<button type="submit" disabled={procesando} className="btn btn-dark btn-full">{procesando ? 'Procesando pago simulado...' : `Confirmar compra · ${dinero(total)}`}</button><p className="microcopy">Consejo: usá 4242 4242 4242 4242, 12/29 y 123. Una tarjeta que termine en 0000 simula un error.</p></form><div><Summary titulo="Resumen de compra" lineas={items.map(item => { const evento = eventos.find(ev => ev.id === item.eventoId); return { nombre: `${evento?.nombre || 'Evento'} · ${item.cantidad}`, valor: item.precio * item.cantidad }; })} total={total}/><button className="btn btn-outline btn-full top-gap" onClick={() => navegar('carrito')} disabled={procesando}>Volver al carrito</button></div></div>
  </main>;
}
