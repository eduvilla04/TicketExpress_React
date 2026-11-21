export const inicial = {
  carrito: [],
  ordenes: [],
  sesion: null,
  ciudad: 'San Salvador',
  eventosEstado: {},
  inventarioAjustes: {}
};

export function reducer(estado, accion) {
  switch (accion.type) {
    case 'AGREGAR_CARRITO': {
      const encontrado = estado.carrito.find(item => item.eventoId === accion.item.eventoId && item.zonaId === accion.item.zonaId);
      return { ...estado, carrito: encontrado
        ? estado.carrito.map(item => item === encontrado ? { ...item, cantidad: item.cantidad + accion.item.cantidad } : item)
        : [...estado.carrito, accion.item] };
    }
    case 'CAMBIAR_CANTIDAD': return { ...estado, carrito: estado.carrito.map(item => item.eventoId === accion.eventoId && item.zonaId === accion.zonaId ? { ...item, cantidad: accion.cantidad } : item) };
    case 'QUITAR_CARRITO': return { ...estado, carrito: estado.carrito.filter(item => item.eventoId !== accion.eventoId || item.zonaId !== accion.zonaId) };
    case 'COMPRAR': return { ...estado, carrito: [], ordenes: [accion.orden, ...estado.ordenes] };
    case 'SESION': return { ...estado, sesion: accion.usuario };
    case 'CERRAR_SESION': return { ...estado, sesion: null };
    case 'CIUDAD': return { ...estado, ciudad: accion.ciudad };
    case 'EVENTO_ESTADO': return { ...estado, eventosEstado: { ...estado.eventosEstado, [accion.id]: accion.estado } };
    case 'INVENTARIO_AJUSTE': return { ...estado, inventarioAjustes: { ...estado.inventarioAjustes, [accion.clave]: accion.capacidad } };
    default: return estado;
  }
}

