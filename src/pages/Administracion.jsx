import { useState } from 'react';
import { eventos, usuariosDemo, ventasDemo } from '../data/events';
import { useTickets } from '../context/TicketContext';
import { disponibilidad, dinero } from '../utils/helpers';
import { PageTitle, Panel, StateMessage } from '../components/Common';

const pestanas = [
  ['resumen', 'Dashboard'],
  ['eventos', 'Eventos'],
  ['inventario', 'Inventario y precios'],
  ['usuarios', 'Usuarios'],
  ['reportes', 'Reportes']
];

function AdminNav({ actual, cambiar }) {
  return (
    <nav className="admin-nav" aria-label="Panel de administración">
      {pestanas.map(([id, nombre]) => (
        <button
          type="button"
          key={id}
          className={actual === id ? 'active' : ''}
          aria-current={actual === id ? 'page' : undefined}
          onClick={() => cambiar(id)}
        >
          {nombre}
        </button>
      ))}
    </nav>
  );
}

function MetricCard({ titulo, valor, nota }) {
  return (
    <div className="metric-card">
      <span className="muted">{titulo}</span>
      <strong>{valor}</strong>
      <small>{nota}</small>
    </div>
  );
}

function Dashboard({ estado, cambiar }) {
  const ventasEjemplo = ventasDemo.reduce((suma, item) => suma + item.monto, 0);
  const ventasLocales = estado.ordenes.reduce((suma, orden) => suma + orden.total, 0);
  const ingresos = ventasEjemplo + ventasLocales;

  return (
    <>
      <div className="metrics-grid">
        <MetricCard titulo="Ventas acumuladas (demo)" valor={dinero(ingresos)} nota="Datos de ejemplo + compras locales" />
        <MetricCard titulo="Eventos publicados" valor={eventos.length} nota="Catálogo de muestra" />
        <MetricCard titulo="Compras locales" valor={estado.ordenes.length} nota="En este navegador" />
        <MetricCard titulo="Usuarios demo" valor={usuariosDemo.length} nota="Sin base de datos" />
      </div>
      <Panel titulo="Resumen de actividad">
        <p className="muted">El panel muestra datos simulados para practicar la administración de TicketExpress.</p>
        <div className="admin-shortcuts">
          <button className="btn btn-outline" onClick={() => cambiar('eventos')}>Gestionar eventos</button>
          <button className="btn btn-outline" onClick={() => cambiar('inventario')}>Ver inventario</button>
          <button className="btn btn-outline" onClick={() => cambiar('reportes')}>Ver reportes</button>
        </div>
      </Panel>
    </>
  );
}

function AdminEventos({ estado, dispatch }) {
  return (
    <Panel titulo="Gestión de eventos">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Evento</th>
              <th>Categoría</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map(evento => {
              const actual = estado.eventosEstado[evento.id] || evento.estado;
              const siguiente = actual === 'Disponible' ? 'Pausado' : 'Disponible';

              return (
                <tr key={evento.id}>
                  <td><strong>{evento.nombre}</strong></td>
                  <td>{evento.categoria}</td>
                  <td>{evento.fechaTexto}</td>
                  <td>
                    <span className={`status-dot ${actual === 'Disponible' ? 'active' : ''}`}>
                      {actual}
                    </span>
                  </td>
                  <td>
                    <button
                      className="small-btn"
                      type="button"
                      onClick={() => dispatch({ type: 'EVENTO_ESTADO', id: evento.id, estado: siguiente })}
                    >
                      {actual === 'Disponible' ? 'Pausar' : 'Publicar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="microcopy">Los cambios de estado se guardan solo en este navegador.</p>
    </Panel>
  );
}

function AdminInventario({ estado, dispatch }) {
  function cambiarCapacidad(clave, valor) {
    const capacidad = Number(valor);
    if (Number.isInteger(capacidad) && capacidad >= 0 && capacidad <= 5000) {
      dispatch({ type: 'INVENTARIO_AJUSTE', clave, capacidad });
    }
  }

  return (
    <Panel titulo="Inventario y precios">
      <p className="muted">Ajustá la capacidad de prueba por zona. Los precios provienen de los datos simulados.</p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Evento</th>
              <th>Zona</th>
              <th>Precio</th>
              <th>Disponibles</th>
              <th>Capacidad demo</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map(evento => evento.zonas.map(zona => {
              const clave = `${evento.id}:${zona.id}`;
              const tope = estado.inventarioAjustes[clave] ?? zona.capacidad;
              const libres = disponibilidad(evento, zona, estado.ordenes, estado.inventarioAjustes);

              return (
                <tr key={clave}>
                  <td>{evento.nombre}</td>
                  <td>{zona.nombre}</td>
                  <td>{dinero(zona.precio)}</td>
                  <td>{libres}</td>
                  <td>
                    <label className="sr-only" htmlFor={`cap-${clave}`}>
                      Capacidad de {zona.nombre} en {evento.nombre}
                    </label>
                    <input
                      className="capacity-input"
                      id={`cap-${clave}`}
                      type="number"
                      min="0"
                      max="5000"
                      value={tope}
                      onChange={e => cambiarCapacidad(clave, e.target.value)}
                    />
                  </td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function AdminUsuarios() {
  return (
    <Panel titulo="Usuarios de muestra">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo ficticio</th>
              <th>Rol</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuariosDemo.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.rol}</td>
                <td>{usuario.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="microcopy">Los usuarios de la tabla son ficticios. No existe autenticación real.</p>
    </Panel>
  );
}

function BarChart({ datos }) {
  const mayor = Math.max(1, ...datos.map(item => item.monto));

  return (
    <div className="bar-chart" role="img" aria-label="Gráfico de ventas simuladas por evento">
      {datos.map(item => (
        <div className="bar-row" key={item.evento}>
          <span>{item.evento}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${item.monto / mayor * 100}%` }} />
          </div>
          <strong>{dinero(item.monto)}</strong>
        </div>
      ))}
    </div>
  );
}

function AdminReportes({ estado }) {
  const total = ventasDemo.reduce((suma, item) => suma + item.monto, 0);
  const cantidad = ventasDemo.reduce((suma, item) => suma + item.boletos, 0);

  return (
    <>
      <div className="metrics-grid">
        <MetricCard titulo="Ingresos de ejemplo" valor={dinero(total)} nota="No representan ventas reales" />
        <MetricCard titulo="Boletos de ejemplo" valor={cantidad} nota="Valores simulados" />
        <MetricCard titulo="Órdenes realizadas aquí" valor={estado.ordenes.length} nota="Persistidas con localStorage" />
      </div>
      <Panel titulo="Ventas por evento (demo)">
        <BarChart datos={ventasDemo} />
      </Panel>
    </>
  );
}

export default function Administracion({ navegar }) {
  const { estado, dispatch } = useTickets();
  const [pestana, setPestana] = useState('resumen');

  if (estado.sesion?.rol !== 'administrador') {
    return (
      <main className="container inner-page">
        <PageTitle
          etiqueta="ÁREA DEMO"
          titulo="Administración"
          descripcion="Para entrar, iniciá una sesión de administrador de prueba."
        />
        <StateMessage>El panel administrativo está disponible en la sesión de demostración.</StateMessage>
        <button className="btn btn-dark" onClick={() => navegar('login')}>
          Iniciar sesión de prueba
        </button>
      </main>
    );
  }

  return (
    <main className="container inner-page admin-page">
      <PageTitle
        etiqueta="PANEL DE CONTROL"
        titulo="Administración"
        descripcion="Gestión y reportes con datos ficticios."
      />
      <div className="admin-layout">
        <AdminNav actual={pestana} cambiar={setPestana} />
        <div className="admin-main">
          {pestana === 'resumen' && <Dashboard estado={estado} cambiar={setPestana} />}
          {pestana === 'eventos' && <AdminEventos estado={estado} dispatch={dispatch} />}
          {pestana === 'inventario' && <AdminInventario estado={estado} dispatch={dispatch} />}
          {pestana === 'usuarios' && <AdminUsuarios />}
          {pestana === 'reportes' && <AdminReportes estado={estado} />}
        </div>
      </div>
    </main>
  );
}
