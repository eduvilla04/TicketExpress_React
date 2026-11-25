import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { PageTitle, FormField, StateMessage } from '../components/Common';
import { useTickets } from '../context/TicketContext';
import { cuentasDemo, iniciarSesion, registrarDemo, recuperarDemo } from '../api/users';

export default function Autenticacion({ modo = 'login', navegar }) {
  const { dispatch } = useTickets();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ nombre: '', correo: '', clave: '' });
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const actualizar = e => setForm(old => ({ ...old, [e.target.name]: e.target.value }));

  async function enviar(e) {
    e.preventDefault();
    setError(''); setMensaje(''); setCargando(true);
    try {
      if (modo === 'recuperar') {
        setMensaje(await recuperarDemo(form.correo));
      } else {
        const usuario = modo === 'registro' ? await registrarDemo(form) : await iniciarSesion(form);
        dispatch({ type: 'SESION', usuario });
        const destino = location.state?.volver;
        if (destino?.startsWith('/') && !destino.startsWith('//')) navigate(destino, { replace: true });
        else navegar(usuario.rol === 'cliente' ? 'perfil' : 'admin');
      }
    } catch (fallo) {
      setError(fallo.message || 'No se pudo completar la operación.');
    } finally { setCargando(false); }
  }

  async function entrarDemo(cuenta) {
    if (cargando) return;
    setCargando(true); setError('');
    try {
      const usuario = await iniciarSesion({ correo: cuenta.correo, clave: cuenta.clave });
      dispatch({ type: 'SESION', usuario });
      const destino = location.state?.volver;
      if (destino?.startsWith('/') && !destino.startsWith('//')) navigate(destino, { replace: true });
      else navegar(usuario.rol === 'cliente' ? 'perfil' : 'admin');
    } catch (fallo) { setError(fallo.message); }
    finally { setCargando(false); }
  }

  const titulo = modo === 'registro' ? 'Creá tu cuenta' : modo === 'recuperar' ? 'Recuperar acceso' : 'Iniciar sesión';
  return <main className="container inner-page auth-page">
    <PageTitle etiqueta="TU CUENTA" titulo={titulo} descripcion="Sesiones de prueba para TicketExpress."/>
    <form className="panel auth-card" onSubmit={enviar} noValidate>
      {modo === 'registro' && <FormField id="auth-nombre" label="Nombre de demostración" name="nombre" value={form.nombre} onChange={actualizar} required/>}
      <FormField id="auth-correo" label="Correo de demostración" type="email" name="correo" value={form.correo} onChange={actualizar} placeholder="cliente@ticketexpress.test" required/>
      {modo !== 'recuperar' && <FormField id="auth-clave" label="Contraseña de prueba" type="password" name="clave" value={form.clave} onChange={actualizar} placeholder="Demo123!" autoComplete="off" required/>}
      {error && <StateMessage tipo="error">{error}</StateMessage>}
      {mensaje && <StateMessage tipo="success">{mensaje}</StateMessage>}
      <button className="btn btn-dark btn-full" type="submit" disabled={cargando}>
        {cargando ? 'Procesando...' : modo === 'registro' ? 'Registrarme' : modo === 'recuperar' ? 'Simular recuperación' : 'Entrar'}
      </button>
      <div className="auth-links">
        {modo !== 'login' && <button type="button" onClick={() => navegar('login')}>Iniciar sesión</button>}
        {modo !== 'registro' && <button type="button" onClick={() => navegar('registro')}>Crear cuenta</button>}
        {modo !== 'recuperar' && <button type="button" onClick={() => navegar('recuperar')}>¿Olvidaste tu contraseña?</button>}
      </div>
    </form>
    {modo === 'login' && <section className="demo-admin">
      <p className="muted">Acceso rápido a los roles de demostración:</p>
      <div className="demo-roles">
        {cuentasDemo.map(cuenta => <button type="button" key={cuenta.rol} className="btn btn-outline" disabled={cargando} onClick={() => entrarDemo(cuenta)}>
          {cuenta.rol === 'administrador' ? 'Administrador demo' : cuenta.rol === 'organizador' ? 'Organizador demo' : 'Cliente demo'}
        </button>)}
      </div>
    </section>}
    <p className="microcopy auth-microcopy">No se verifican cuentas reales ni se envían correos. Usá datos ficticios.</p>
  </main>;
}

export function Perfil({ navegar }) {
  const { estado, dispatch } = useTickets();
  const usuario = estado.sesion;
  if (!usuario) return null;
  return <main className="container inner-page">
    <PageTitle etiqueta="CUENTA DEMO" titulo="Mi perfil" descripcion="Sesión simulada guardada en este navegador."/>
    <section className="panel profile-panel">
      <div className="profile-avatar" aria-hidden="true">{usuario.nombre.charAt(0).toUpperCase()}</div>
      <div><h2>{usuario.nombre}</h2><p className="muted">{usuario.correo}</p><span className="status-dot">Rol: {usuario.rol}</span></div>
    </section>
    <div className="profile-actions">
      <button className="btn btn-outline" onClick={() => navegar('entradas')}>Mis entradas</button>
      {['administrador', 'organizador'].includes(usuario.rol) && <button className="btn btn-dark" onClick={() => navegar('admin')}>Panel de administración</button>}
      <button className="btn btn-outline" onClick={() => { dispatch({ type: 'CERRAR_SESION' }); navegar('inicio'); }}>Cerrar sesión</button>
    </div>
  </main>;
}
