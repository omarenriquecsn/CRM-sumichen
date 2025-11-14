export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: "vendedor" | "admin";
  activo: boolean;
  fecha_creacion: Date;
  telefono?: string;
  avatar?: string;
}

export interface Cliente {
  id: string;
  vendedor_id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  empresa?: string;
  estado: Estado;
  etapa_venta: EtapaVenta;
  // rif: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  notas?: string;
  direccion?: string;
  ciudad?: string;
  fecha_estado?: Date;
  estado_anterior?: string;
  rif: string;
  direccion_entrega?: string;
  google_maps?: string;
}

export type Estado = "prospecto" | "activo" | "inactivo";

export type EtapaVenta =
  | "inicial"
  | "calificado"
  | "propuesta"
  | "negociacion"
  | "cerrado"
  | "perdido";

export interface ClienteFormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  empresa: string;
  estado: string;
  etapa_venta: string;
  rif: string;
  fecha_creacion: Date;
  notas: string;
  direccion: string;
  ciudad: string;
  direccion_entrega: string;
  google_maps: string;
}

export interface Actividad {
  id: string;
  cliente_id: string;
  vendedor_id: string;
  tipo: "llamada" | "email" | "reunion" | "nota" | "tarea";
  titulo: string;
  descripcion: string;
  fecha: Date;
  completado: boolean;
  fecha_vencimiento: Date;
  fecha_creacion: Date;
  id_tipo_actividad?: string;
}

export interface ICrearActividad {
  titulo: string;
  tipo: string;
  descripcion: string;
  fecha: Date;
  fecha_vencimiento: Date;
  cliente_id: string;
  vendedor_id: string;
  completado: boolean;
}

export interface ReunionDb extends Omit<Reunion, 'fecha_inicio' | 'fecha_fin'> {
  fecha_creacion: string;
  fecha_actualizacion: string;
}
export interface Reunion {
  id: string;
  cliente_id: string;
  vendedor_id: string;
  titulo: string;
  descripcion: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  ubicacion?: string;
  tipo: "presencial" | "virtual" | "telefonica";
  estado: "programada" | "completada" | "cancelada";
  recordatorio: boolean;
}

export interface ReunionCalendario extends Reunion {
 fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface ICrearReunion {
  cliente_id: string;
  vendedor_id: string;
  titulo: string;
  descripcion: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  ubicacion?: string;
  tipo: "presencial" | "virtual" | "telefonica";
  estado: "programada" | "completada" | "cancelada";
  recordatorio: boolean;
}

export interface IFormReunion {
  cliente_id: string;
  vendedor_id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  inicio: string;
  fin: string;
  ubicacion?: string;
  tipo: "presencial" | "virtual" | "telefonica";
  estado: "programada" | "completada" | "cancelada";
  recordatorio: boolean;
}

export interface Ticket {
  id: string;
  cliente_id: string;
  vendedor_id: string;
  titulo: string;
  descripcion: string;
  estado: "abierto" | "en_proceso" | "resuelto" | "cerrado";
  prioridad: "baja" | "media" | "alta" | "urgente";
  categoria: "tecnico" | "facturacion" | "producto" | "servicio";
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  numero: number;
}

export interface Pedido {
  id: string;
  cliente_id: string;
  vendedor_id: string;
  numero: string;
  subtotal: number;
  impuestos: number;
  total: number;
  estado: "pendiente" | "procesado";
  fecha_entrega: Date;
  notas?: string;
  fecha_creacion: Date;
  fecha_actualizacion?: Date;
  tipo_pago: "contado" | "credito";
  dias_credito?: number;
  moneda: "usd" | "bs";
  transporte: "interno" | "externo";
  evidencia_url?: string;
  productos_pedido: ProductoPedido[];
}

export enum MesEnum {
  Enero = "Enero",
  Febrero = "Febrero",
  Marzo = "Marzo",
  Abril = "Abril",
  Mayo = "Mayo",
  Junio = "Junio",
  Julio = "Julio",
  Agosto = "Agosto",
  Septiembre = "Septiembre",
  Octubre = "Octubre",
  Noviembre = "Noviembre",
  Diciembre = "Diciembre",
}


export interface Meta {
  id: string;
  vendedor_id: string;
  mes: MesEnum;
  ano: number;
  objetivo_ventas: number;
  objetivo_clientes: number;
  llamadas: number;
  reuniones: number;
  emails: number;
  tareas: number;
}

export interface Metrica {
  periodo: string;
  ventas: number;
  clientes: number;
  actividades: number;
  conversion: number;
}

export interface Oportunidad {
  id: string;
  cliente_id: string;
  vendedor_id: string;
  titulo: string;
  descripcion: string;
  valor: number;
  probabilidad: number;
  etapa: "inicial" | "calificado" | "propuesta" | "negociacion" | "cerrado";
  fecha_creacion: Date;
}

export interface ICreateOportunidad {
  cliente_id: string;
  vendedor_id: string;
  titulo: string;
  descripcion: string;
  valor: number;
  probabilidad: number;
  etapa: "inicial" | "calificado" | "propuesta" | "negociacion" | "cerrado";
  fecha_creacion: Date;
}

export interface ProductoPedido {
  pedido_id: string;
  nombre: string;
  descripcion?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  fecha_creacion: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  unidad_medida: string;
  fecha_creacion: string;
  precio_base?: number
}
export type formProducto = {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  nombre: string;
  descripcion: string;
  precio_base?: number
};

export interface PedidoData extends Pedido {
  productos: formProducto[];
  archivoAdjunto?: File | null;
}



export interface ProductoPedido {
  id: string;
  pedido_id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  total: number;
  producto_id: string;
  producto: Producto;
}

export interface ProductoDb {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
}

export interface PedidoDb {
  cliente_id: string;
  vendedor_id: string;
  fecha_entrega: Date;
  notas?: string;
  tipo_pago: "contado" | "credito";
  dias_credito?: number;
  moneda: "usd" | "bs";
  transporte: "interno" | "externo";
  impuestos: 'iva' | 'exento';
}


export type ActividadFormateada = {
  id: string;
  type: string;
  title: string;
  time: string;
  status: 'vencida' | 'completada' | 'pendiente';
  cliente: string | undefined;
  vendedor: string | undefined;
};

export type Mes = {
  mes: string;
  ventas: number;
  clientes: number | undefined;
}

 export type CrearPedidoParams = {
    pedidoData: Partial<Pedido>;
    productosPedido: formProducto[];
    currentUser: User;
  };

  export interface Vendedor {
    id: string;
   supabase_id: string;
   nombre: string;
   apellido: string;
   telefono: string;
    fecha_creacion: Date;
    rol: "vendedor" | "admin";
    monto_negociacion_mes?: number;
  }