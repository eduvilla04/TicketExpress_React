import { obtenerJSON, pausa, leerAlmacen, guardarAlmacen } from './base.js';

const CLAVE = 'ticketexpress_api_usuarios_v3';
export const cuentasDemo = [
  { correo: 'cliente@ticketexpress.test', clave: 'Demo123!', nombre: 'Cliente demo', rol: 'cliente' },
  { correo: 'admin@ticketexpress.test', clave: 'Demo123!', nombre: 'Administrador demo', rol: 'administrador' },
  { correo: 'organizador@ticketexpress.test', clave: 'Demo123!', nombre: 'Organizador demo', rol: 'organizador' }
];

export async function listarUsuarios({ signal } = {}) {
  await pausa(200, signal);
  const base = await obtenerJSON('users.json', { signal });
  const actualizados = leerAlmacen(CLAVE, {});
  return base.map(user => ({ ...user, ...(actualizados[user.id] || {}) }));
}

export async function modificarUsuario(id, cambios) {
  await pausa(250);
  const users = await listarUsuarios();
  if (!users.some(user => user.id === id)) throw new Error('Usuario no encontrado.');
  const actuales = leerAlmacen(CLAVE, {});
  guardarAlmacen(CLAVE, { ...actuales, [id]: { ...(actuales[id] || {}), ...cambios } });
}

export async function iniciarSesion({ correo, clave }) {
  await pausa(420);
  const demo = cuentasDemo.find(u => u.correo === correo.trim().toLowerCase() && u.clave === clave);
  if (!demo) throw new Error('Credenciales demo incorrectas. Revisá los datos de prueba del README.');
  return { nombre: demo.nombre, correo: demo.correo, rol: demo.rol };
}

export async function registrarDemo({ nombre, correo, clave }) {
  await pausa(420);
  if (nombre.trim().length < 3 || !/^\S+@\S+\.\S+$/.test(correo) || clave.length < 6) {
    throw new Error('Completá los datos de demostración correctamente.');
  }
  return { nombre: nombre.trim(), correo: correo.trim(), rol: 'cliente' };
}

export async function recuperarDemo(correo) {
  await pausa(400);
  if (!/^\S+@\S+\.\S+$/.test(correo)) throw new Error('Ingresá un correo con formato válido.');
  return 'Recuperación simulada. No se envió ningún correo.';
}
