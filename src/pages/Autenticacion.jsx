import { useState } from 'react';
import { PageTitle, FormField, StateMessage } from '../components/Common';
import { useTickets } from '../context/TicketContext';
import { esperar, validarCorreo } from '../utils/helpers';

export default function Autenticacion({ modo = 'login', navegar }) {
  const { estado, dispatch } = useTickets();
  const [form, setForm] = useState({ nombre: '', correo: '', clave: '' });
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const actualizar = e => setForm(v => ({ ...v, [e.target.name]: e.target.value }));
  async function enviar(e) {
    e.preventDefault(); setError(''); setMensaje('');
    if (!validarCorreo(form.correo)) { setError('Ingresá un correo de demostración válido.'); return; }
    if (modo !== 'recuperar' && form.clave.length < 6) { setError('La contraseña de demostración debe tener al menos 6 caracteres.'); return; }
    if (modo === 'registro' && form.nombre.trim().length < 3) { setError('Ingresá un nombre de demostración.'); return; }
    setCargando(true);
    try {
      await esperar(550);
      if (modo === 'recuperar') { setMensaje('Recuperación simulada. No se envió ningún correo.'); return; }
      dispatch({ type: 'SESION', usuario: { nombre: modo === 'registro' ? form.nombre.trim() : 'Cliente demo', correo: form.correo, rol: 'cliente' } });
      navegar('perfil');
    } finally { setCargando(false); }
  }
  function adminDemo() { dispatch({ type: 'SESION', usuario: { nombre: 'Administrador demo', correo: 'admin@demo.com', rol: 'administrador' } }); navegar('admin'); }
  const titulo = modo === 'registro' ? 'Creá tu cuenta' : modo === 'recuperar' ? 'Recuperar acceso' : 'Iniciar sesión';
  return <main className="container inner-page auth-page"><PageTitle etiqueta="TU CUENTA" titulo={titulo} descripcion="Acceso simulado para el prototipo de TicketExpress."/><form className="panel auth-card" onSubmit={enviar} noValidate>{modo === 'registro' && <FormField id="auth-nombre" label="Nombre de demostración" name="nombre" value={form.nombre} onChange={actualizar} required/>}<FormField id="auth-correo" label="Correo de demostración" type="email" name="correo" value={form.correo} onChange={actualizar} placeholder="demo@ejemplo.com" required/>{modo !== 'recuperar' && <FormField id="auth-clave" label="Contraseña de prueba" type="password" name="clave" value={form.clave} onChange={actualizar} autoComplete="off" required/>}{error && <StateMessage tipo="error">{error}</StateMessage>}{mensaje && <StateMessage tipo="success">{mensaje}</StateMessage>}<button className="btn btn-dark btn-full" type="submit" disabled={cargando}>{cargando ? 'Procesando...' : modo === 'registro' ? 'Registrarme' : modo === 'recuperar' ? 'Simular recuperación' : 'Entrar'}</button><div className="auth-links">{modo !== 'login' && <button type="button" onClick={() => navegar('login')}>Iniciar sesión</button>}{modo !== 'registro' && <button type="button" onClick={() => navegar('registro')}>Crear cuenta</button>}{modo !== 'recuperar' && <button type="button" onClick={() => navegar('recuperar')}>¿Olvidaste tu contraseña?</button>}</div></form>{modo === 'login' && <div className="demo-admin"><p className="muted">Para revisar el panel de administración:</p><button type="button" className="btn btn-outline" onClick={adminDemo}>Entrar como administrador demo</button></div>}<p className="microcopy auth-microcopy">No se valida ninguna cuenta real ni se envían correos. Usá únicamente datos de prueba.</p></main>;
}

export function Perfil({ navegar }) {
  const { estado, dispatch } = useTickets();
  const usuario = estado.sesion;
  if (!usuario) return <main className="container inner-page"><PageTitle titulo="Mi perfil" descripcion="Iniciá sesión para ver el perfil de demostración."/><button className="btn btn-dark" onClick={() => navegar('login')}>Iniciar sesión</button></main>;
  return <main className="container inner-page"><PageTitle etiqueta="CUENTA DEMO" titulo="Mi perfil" descripcion="Datos de la sesión simulada guardados en este navegador."/><section className="panel profile-panel"><div className="profile-avatar" aria-hidden="true">{usuario.nombre.charAt(0).toUpperCase()}</div><div><h2>{usuario.nombre}</h2><p className="muted">{usuario.correo}</p><span className="status-dot">Rol: {usuario.rol}</span></div></section><div className="profile-actions"><button className="btn btn-outline" onClick={() => navegar('entradas')}>Ver mis entradas</button>{usuario.rol === 'administrador' && <button className="btn btn-dark" onClick={() => navegar('admin')}>Administrar eventos</button>}<button className="btn btn-outline" onClick={() => { dispatch({ type: 'CERRAR_SESION' }); navegar('inicio'); }}>Cerrar sesión</button></div></main>;
}
