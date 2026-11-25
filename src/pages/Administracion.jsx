import { useEffect, useMemo, useState } from 'react';
import { categorias } from '../data/events';
import { ordenesDemo } from '../data/demoOrders';
import { useCatalogo } from '../providers/EventProvider';
import { useTickets } from '../context/TicketContext';
import { listarUsuarios, modificarUsuario } from '../api/users';
import { dinero, disponibilidad } from '../utils/helpers';
import { calcularReporte } from '../utils/reports';
import { verificarBoleto } from '../utils/tickets';
import { PageTitle, Panel, StateMessage, Loading, EmptyState } from '../components/Common';

const pestanas = [
  ['resumen', 'Dashboard', 'admin'], ['eventos', 'Eventos', 'adminEventos'],
  ['inventario', 'Inventario y precios', 'adminInventario'],
  ['usuarios', 'Usuarios', 'adminUsuarios'], ['reportes', 'Reportes', 'adminReportes'],
  ['verificar', 'Verificar QR', 'adminVerificar']
];

function AdminNav({ seccion, navegar, rol }) {
  return <nav className="admin-nav" aria-label="Panel de administración">
    {pestanas.filter(([id]) => rol === 'administrador' || !['usuarios', 'reportes'].includes(id)).map(([id, titulo, ruta]) =>
      <button type="button" key={id} className={seccion === id ? 'active' : ''} aria-current={seccion === id ? 'page' : undefined} onClick={() => navegar(ruta)}>{titulo}</button>
    )}
  </nav>;
}

function MetricCard({ titulo, valor, nota }) {
  return <div className="metric-card"><span className="muted">{titulo}</span><strong>{valor}</strong><small>{nota}</small></div>;
}

function Dashboard({ eventos, ordenes, navegar, rol }) {
  const monto = ordenes.reduce((sum, o) => sum + o.total, 0);
  const disponibles = eventos.filter(e => e.estado === 'Disponible').length;
  const cantidad = ordenes.flatMap(o => o.items).reduce((sum, i) => sum + i.cantidad, 0);
  return <>
    <div className="metrics-grid">
      <MetricCard titulo="Ventas acumuladas (demo)" valor={dinero(monto)} nota="Ejemplo + compras locales"/>
      <MetricCard titulo="Eventos publicados" valor={disponibles} nota={`${eventos.length} en el catálogo`}/>
      <MetricCard titulo="Boletos en órdenes" valor={cantidad} nota="Valores de demostración"/>
      <MetricCard titulo="Compras registradas" valor={ordenes.length} nota="Actualizado al comprar"/>
    </div>
    <Panel titulo="Gestión rápida">
      <p className="muted">Administrá los eventos y sus zonas desde un solo lugar. Todos los cambios son locales.</p>
      <div className="admin-shortcuts">
        <button className="btn btn-outline" onClick={() => navegar('adminEventos')}>Gestionar eventos</button>
        <button className="btn btn-outline" onClick={() => navegar('adminInventario')}>Inventario</button>
        {rol === 'administrador' && <button className="btn btn-outline" onClick={() => navegar('adminReportes')}>Reportes</button>}
      </div>
    </Panel>
  </>;
}

function fechaCorta(fecha) {
  if (!fecha) return 'FECHA PENDIENTE';
  const d = new Date(fecha);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = d.toLocaleDateString('es-SV', { month: 'short' }).replace('.', '').toUpperCase();
  return `${dia} ${mes} · ${d.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true })}`;
}

const zonasVacias = () => [
  { id:'general', nombre:'General', precio:20, capacidad:100 },
  { id:'preferencial', nombre:'Preferencial', precio:35, capacidad:50 },
  { id:'vip', nombre:'VIP', precio:55, capacidad:20 }
];
const inicioForm = () => ({ nombre:'', categoria:'Música', fecha:'2027-12-20T19:00', lugar:'', ciudad:'San Salvador', descripcion:'', estado:'Disponible', zonas:zonasVacias() });

function FormularioEvento({ actual, cerrar, guardar }) {
  const [datos, setDatos] = useState(actual ? {
    ...actual, fecha: actual.fecha?.slice(0,16) || '', zonas: actual.zonas.map(z => ({...z}))
  } : inicioForm);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const cambiar = e => setDatos(p => ({ ...p, [e.target.name]: e.target.value }));
  const cambiarZona = (id, propiedad, valor) => setDatos(p => ({ ...p, zonas: p.zonas.map(z => z.id === id ? {...z, [propiedad]: Number(valor)} : z) }));

  async function enviar(e) {
    e.preventDefault();setEnviando(true);setError('');
    try {
      await guardar({ ...datos, fechaTexto: fechaCorta(datos.fecha), precioDesde: Math.min(...datos.zonas.map(z => z.precio)), tituloPoster: datos.nombre.toUpperCase(), poster: datos.poster || 'nocturna' });
      cerrar();
    } catch (fallo) { setError(fallo.message || 'No se pudo guardar el evento.'); }
    finally { setEnviando(false); }
  }
  return <section className="panel admin-editor" aria-label="Formulario de evento">
    <div className="panel-head"><h2>{actual ? 'Editar evento' : 'Nuevo evento'}</h2><button className="small-btn" onClick={cerrar}>Cerrar</button></div>
    <form onSubmit={enviar} className="admin-form">
      <div className="admin-form-grid">
        <label>Nombre<input name="nombre" value={datos.nombre} onChange={cambiar} required maxLength="70"/></label>
        <label>Categoría<select name="categoria" value={datos.categoria} onChange={cambiar}>{categorias.slice(1).map(c => <option key={c}>{c}</option>)}</select></label>
        <label>Fecha<input type="datetime-local" name="fecha" value={datos.fecha} onChange={cambiar} required/></label>
        <label>Lugar<input name="lugar" value={datos.lugar} onChange={cambiar} required/></label>
        <label>Ciudad<select name="ciudad" value={datos.ciudad} onChange={cambiar}><option>San Salvador</option><option>Santa Tecla</option></select></label>
        <label>Estado<select name="estado" value={datos.estado} onChange={cambiar}><option>Disponible</option><option>Pausado</option></select></label>
      </div>
      <label className="admin-description">Descripción<textarea name="descripcion" value={datos.descripcion} onChange={cambiar} rows="3"/></label>
      <h3>Zonas</h3>
      <div className="zone-editor">
        {datos.zonas.map(z => <div className="zone-edit-row" key={z.id}>
          <strong>{z.nombre}</strong>
          <label>Precio ($)<input type="number" min="0" step="0.01" value={z.precio} onChange={e => cambiarZona(z.id, 'precio', e.target.value)} required/></label>
          <label>Capacidad<input type="number" min="0" max="5000" step="1" value={z.capacidad} onChange={e => cambiarZona(z.id, 'capacidad', e.target.value)} required/></label>
        </div>)}
      </div>
      {error && <StateMessage tipo="error">{error}</StateMessage>}
      <div className="admin-actions"><button type="submit" className="btn btn-dark" disabled={enviando}>{enviando ? 'Guardando...' : 'Guardar evento'}</button><button type="button" className="btn btn-outline" onClick={cerrar}>Cancelar</button></div>
    </form>
  </section>;
}

function AdminEventos({ eventos, crear, editar, eliminar }) {
  const [editando, setEditando] = useState(null);
  const [abierto, setAbierto] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  async function cambiarEstado(e) {
    setBusy(e.id); setError('');
    try { await editar(e.id, { estado: e.estado === 'Disponible' ? 'Pausado' : 'Disponible' }); }
    catch (fallo) { setError(fallo.message); }
    finally { setBusy(''); }
  }
  async function borrar(e) {
    if (!window.confirm(`¿Eliminar el evento "${e.nombre}" de la demo?`)) return;
    setBusy(e.id); setError('');
    try { await eliminar(e.id); }
    catch (fallo) { setError(fallo.message); }
    finally { setBusy(''); }
  }
  return <>
    {abierto && <FormularioEvento key={editando?.id || 'nuevo'} actual={editando} cerrar={() => {setAbierto(false);setEditando(null);}} guardar={datos => editando ? editar(editando.id, datos) : crear(datos)}/>}
    <Panel titulo="Gestión de eventos" accion={<button type="button" className="btn btn-dark" onClick={() => {setEditando(null);setAbierto(true);}}>+ Crear evento</button>}>
      {error && <StateMessage tipo="error">{error}</StateMessage>}
      <div className="table-scroll"><table><thead><tr><th>Evento</th><th>Categoría</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>{eventos.map(e => <tr key={e.id}>
          <td><strong>{e.nombre}</strong></td><td>{e.categoria}</td><td>{e.fechaTexto}</td>
          <td><span className={`status-dot ${e.estado === 'Disponible' ? 'active' : ''}`}>{e.estado}</span></td>
          <td><div className="table-actions">
            <button className="small-btn" disabled={busy === e.id} onClick={() => {setEditando(e);setAbierto(true);}}>Editar</button>
            <button className="small-btn" disabled={busy === e.id} onClick={() => cambiarEstado(e)}>{e.estado === 'Disponible' ? 'Pausar' : 'Publicar'}</button>
            <button className="small-btn danger" disabled={busy === e.id} onClick={() => borrar(e)}>Eliminar</button>
          </div></td>
        </tr>)}</tbody></table></div>
      {!eventos.length && <p className="muted">No hay eventos registrados.</p>}
      <p className="microcopy">Los cambios se guardan únicamente en el navegador. La API es simulada.</p>
    </Panel>
  </>;
}

function ZonaFila({ evento, zona, ordenes, editarZona }) {
  const [precio, setPrecio] = useState(String(zona.precio));
  const [capacidad, setCapacidad] = useState(String(zona.capacidad));
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  useEffect(() => { setPrecio(String(zona.precio)); setCapacidad(String(zona.capacidad)); }, [zona.precio,zona.capacidad]);
  async function guardar() {
    setGuardando(true);setError('');
    try { await editarZona(evento.id,zona.id,{ precio: Number(precio), capacidad: Number(capacidad) }); }
    catch(fallo) { setError(fallo.message); }
    finally { setGuardando(false); }
  }
  return <tr>
    <td>{evento.nombre}</td><td>{zona.nombre}</td>
    <td><input aria-label={`Precio de ${zona.nombre} en ${evento.nombre}`} className="capacity-input" type="number" min="0" step="0.01" value={precio} onChange={e=>setPrecio(e.target.value)}/></td>
    <td><input aria-label={`Capacidad de ${zona.nombre} en ${evento.nombre}`} className="capacity-input" type="number" min="0" max="5000" step="1" value={capacidad} onChange={e=>setCapacidad(e.target.value)}/></td>
    <td>{disponibilidad(evento,zona,ordenes)}</td>
    <td><button className="small-btn" type="button" disabled={guardando} onClick={guardar}>{guardando ? '...' : 'Guardar'}</button>{error && <small className="field-error">{error}</small>}</td>
  </tr>;
}

function AdminInventario({ eventos, ordenes, editarZona }) {
  return <Panel titulo="Inventario y precios">
    <p className="muted">Modificá precios y capacidad de cada zona. Los cambios se reflejan al comprar.</p>
    <div className="table-scroll"><table><thead><tr><th>Evento</th><th>Zona</th><th>Precio ($)</th><th>Capacidad</th><th>Disponibles</th><th>Acción</th></tr></thead>
    <tbody>{eventos.flatMap(e=>e.zonas.map(z=><ZonaFila key={`${e.id}-${z.id}`} evento={e} zona={z} ordenes={ordenes} editarZona={editarZona}/>))}</tbody></table></div>
  </Panel>;
}

function AdminUsuarios() {
  const [usuarios,setUsuarios]=useState([]);
  const [cargando,setCargando]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{
    const controller = new AbortController();
    listarUsuarios({signal:controller.signal}).then(setUsuarios).catch(e=>{if(e.name!=='AbortError')setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setCargando(false);});
    return ()=>controller.abort();
  },[]);
  async function estadoNuevo(usuario) {
    try {
      const siguiente = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
      await modificarUsuario(usuario.id,{estado:siguiente});
      setUsuarios(us=>us.map(u=>u.id===usuario.id?{...u,estado:siguiente}:u));
    }catch(e){setError(e.message);}
  }
  return <Panel titulo="Usuarios de prueba">
    <p className="muted">Cuentas ficticias. Se puede modificar su estado local.</p>
    {cargando && <Loading texto="Cargando usuarios..."/>}
    {error && <StateMessage tipo="error">{error}</StateMessage>}
    <div className="table-scroll"><table><thead><tr><th>Nombre</th><th>Correo ficticio</th><th>Rol</th><th>Estado</th><th>Acción</th></tr></thead>
    <tbody>{usuarios.map(u=><tr key={u.id}><td>{u.nombre}</td><td>{u.correo}</td><td>{u.rol}</td><td>{u.estado}</td><td><button className="small-btn" onClick={()=>estadoNuevo(u)}>{u.estado==='Activo'?'Desactivar':'Activar'}</button></td></tr>)}</tbody></table></div>
  </Panel>;
}

function BarChart({ datos }) {
  const mayor = Math.max(1, ...datos.map(d=>d.monto));
  return <div className="bar-chart" role="img" aria-label="Gráfico de ventas por evento">
    {datos.map(d=><div className="bar-row" key={d.evento}>
      <span>{d.evento}</span><div className="bar-track"><div className="bar-fill" style={{width:`${d.monto/mayor*100}%`}}/></div><strong>{dinero(d.monto)}</strong>
    </div>)}
  </div>;
}


function AdminReportes({ eventos, ordenes }) {
  const [periodo,setPeriodo]=useState('0');
  const reporte=useMemo(()=>calcularReporte(ordenes,eventos,Number(periodo)),[eventos,ordenes,periodo]);
  return <>
    <div className="report-filter"><label htmlFor="periodo">Periodo de compra</label><select id="periodo" value={periodo} onChange={e=>setPeriodo(e.target.value)}><option value="0">Todo</option><option value="7">Últimos 7 días</option><option value="30">Últimos 30 días</option><option value="90">Últimos 90 días</option></select></div>
    <div className="metrics-grid">
      <MetricCard titulo="Ingresos simulados" valor={dinero(reporte.monto)} nota="Sumados desde órdenes"/>
      <MetricCard titulo="Boletos" valor={reporte.boletos} nota="Cantidades vendidas"/>
      <MetricCard titulo="Órdenes" valor={reporte.ordenes} nota="Incluye ejemplos"/>
    </div>
    <Panel titulo="Ventas por evento y periodo">
      {reporte.filas.length?<BarChart datos={reporte.filas}/>:<EmptyState titulo="No hay ventas en este periodo" descripcion="Probá con otra fecha o realizá una compra de prueba."/>}
      <p className="microcopy">Los resultados cambian al confirmar una compra. Se incluyen cinco órdenes ficticias de ejemplo.</p>
    </Panel>
  </>;
}


function AdminVerificar({ ordenes, eventos }) {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);
  function comprobar(e) {
    e.preventDefault();
    setResultado(verificarBoleto(codigo, ordenes, eventos));
  }
  return <Panel titulo="Verificación de boletos">
    <p className="muted">Escaneá un QR con el celular y pegá su texto aquí. Se compara con las compras registradas en este navegador.</p>
    <form onSubmit={comprobar} className="verify-form">
      <label htmlFor="qr-codigo">Identificador del boleto</label>
      <div className="verify-controls">
        <input id="qr-codigo" value={codigo} onChange={e => { setCodigo(e.target.value); setResultado(null); }} placeholder="TE|TE-...|nocturna|general|1" required />
        <button className="btn btn-dark" type="submit">Verificar</button>
      </div>
    </form>
    {resultado && <StateMessage tipo={resultado.valido ? 'success' : 'error'}>
      <strong>{resultado.valido ? 'Boleto encontrado' : 'No se pudo validar'}</strong> — {resultado.mensaje}
      {resultado.valido && <p className="microcopy">{resultado.evento} · {resultado.zona} · Boleto {resultado.boleto} · Orden {resultado.ordenId}</p>}
    </StateMessage>}
    <p className="microcopy">La validación es local y de demostración; no es un sistema real de control de acceso.</p>
  </Panel>;
}

export default function Administracion({ navegar, seccion = 'resumen' }) {
  const { estado } = useTickets();
  const { eventos,cargando,error,recargar,crear,editar,eliminar,editarZona } = useCatalogo();
  const ordenes = useMemo(()=>[...ordenesDemo,...estado.ordenes],[estado.ordenes]);
  return <main className="container inner-page admin-page">
    <PageTitle etiqueta="PANEL DE CONTROL" titulo="Administración" descripcion="Eventos, inventario y reportes con datos simulados."/>
    <div className="admin-layout">
      <AdminNav seccion={seccion} navegar={navegar} rol={estado.sesion?.rol}/>
      <div className="admin-main">
        {cargando && <Loading texto="Consultando API de eventos..."/>}
        {error && <StateMessage tipo="error">{error} <button onClick={()=>recargar()}>Reintentar</button></StateMessage>}
        {!cargando && !error && <>
          {seccion==='resumen' && <Dashboard eventos={eventos} ordenes={ordenes} navegar={navegar} rol={estado.sesion?.rol}/>}
          {seccion==='eventos' && <AdminEventos eventos={eventos} crear={crear} editar={editar} eliminar={eliminar}/>}
          {seccion==='inventario' && <AdminInventario eventos={eventos} ordenes={ordenes} editarZona={editarZona}/>}
          {seccion==='usuarios' && <AdminUsuarios/>}
          {seccion==='reportes' && <AdminReportes eventos={eventos} ordenes={ordenes}/>}
          {seccion==='verificar' && <AdminVerificar eventos={eventos} ordenes={estado.ordenes}/>} 
        </>}
      </div>
    </div>
  </main>;
}
