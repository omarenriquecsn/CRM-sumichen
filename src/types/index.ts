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
  cargo?: string;
  estado: Estado;
  etapa_venta: EtapaVenta;
  valor_potencial: number;
  fecha_creacion: Date;
  ultima_actividad: Date;
  notas?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  rol: 'vendedor' | 'admin'
}

type Estado = "prospecto" | "cliente" | "inactivo";

type EtapaVenta =
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
  empresa?: string;
  cargo?: string;
  estado: Estado;
  etapa_venta: EtapaVenta;
  valor_potencial: number;
  fecha_creacion: Date;
  ultima_actividad: Date;
  notas?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
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
  fecha_vencimiento?: Date;
}

export interface ICrearActividad {
  cliente_id: string;
  vendedor_id: string;
  tipo: "llamada" | "email" | "reunion" | "nota" | "tarea";
  titulo: string;
  descripcion: string;
  fecha: Date;
  completado: boolean;
  fecha_vencimiento?: Date;
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
}

export interface Pedido {
  id: string;
  cliente_id: string;
  vendedor_id: string;
  numero: string;
  estado: string;
  subtotal: number;
  impuestos: number;
  total: number;
  fecha_entrega: string;       
  notas?: string;
  fecha_creacion: string;
  fecha_actualizacion?: string;
  tipo_pago: 'contado' | 'credito';
  dias_credito?: number;
  moneda: 'usd' | 'bs';
  transporte: 'interno' | 'externo';
}

export interface ProductoPedido {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

export interface Meta {
  id: string;
  vendedor_id: string;
  mes: number;
  ano: number;
  objetivo_ventas: number;
  objetivo_clientes: number;
  ventas_actuales: number;
  clientes_actuales: number;
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
  id: string;                 
  pedido_id: string;         
  nombre: string;
  descripcion?: string;    
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  fecha_creacion: string;   
}