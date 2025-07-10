/*
  # Esquema completo del CRM

  1. Nuevas Tablas
    - `vendedores` - Información de los vendedores
    - `clientes` - Gestión de clientes y prospectos
    - `actividades` - Registro de actividades de ventas
    - `reuniones` - Programación y seguimiento de reuniones
    - `tickets` - Sistema de tickets de soporte
    - `pedidos` - Gestión de pedidos de clientes
    - `productos_pedido` - Detalles de productos en pedidos
    - `metas` - Metas mensuales de vendedores
    - `oportunidades` - Pipeline de ventas

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para que vendedores solo accedan a sus datos
    - Políticas especiales para administradores

  3. Funciones
    - Triggers para actualizar timestamps
    - Funciones para cálculos automáticos
*/

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de vendedores (extiende auth.users)
CREATE TABLE IF NOT EXISTS vendedores (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  apellido text NOT NULL,
  telefono text,
  rol text NOT NULL DEFAULT 'vendedor' CHECK (rol IN ('vendedor', 'admin')),
  activo boolean DEFAULT true,
  meta_mensual_ventas numeric DEFAULT 0,
  meta_mensual_clientes integer DEFAULT 0,
  fecha_creacion timestamptz DEFAULT now(),
  fecha_actualizacion timestamptz DEFAULT now()
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendedor_id uuid NOT NULL REFERENCES vendedores(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  apellido text NOT NULL,
  email text UNIQUE NOT NULL,
  telefono text,
  empresa text,
  cargo text,
  estado text NOT NULL DEFAULT 'prospecto' CHECK (estado IN ('prospecto', 'cliente', 'inactivo')),
  etapa_venta text NOT NULL DEFAULT 'inicial' CHECK (etapa_venta IN ('inicial', 'calificado', 'propuesta', 'negociacion', 'cerrado', 'perdido')),
  valor_potencial numeric DEFAULT 0,
  probabilidad integer DEFAULT 0 CHECK (probabilidad >= 0 AND probabilidad <= 100),
  direccion text,
  ciudad text,
  codigo_postal text,
  notas text,
  fecha_creacion timestamptz DEFAULT now(),
  ultima_actividad timestamptz DEFAULT now(),
  fecha_actualizacion timestamptz DEFAULT now()
);

-- Tabla de actividades
CREATE TABLE IF NOT EXISTS actividades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  vendedor_id uuid NOT NULL REFERENCES vendedores(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('llamada', 'email', 'reunion', 'nota', 'tarea')),
  titulo text NOT NULL,
  descripcion text,
  fecha timestamptz DEFAULT now(),
  fecha_vencimiento timestamptz,
  completado boolean DEFAULT false,
  fecha_creacion timestamptz DEFAULT now(),
  fecha_actualizacion timestamptz DEFAULT now()
);

-- Tabla de reuniones
CREATE TABLE IF NOT EXISTS reuniones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  vendedor_id uuid NOT NULL REFERENCES vendedores(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descripcion text,
  fecha_inicio timestamptz NOT NULL,
  fecha_fin timestamptz NOT NULL,
  ubicacion text,
  tipo text NOT NULL DEFAULT 'presencial' CHECK (tipo IN ('presencial', 'virtual', 'telefonica')),
  estado text NOT NULL DEFAULT 'programada' CHECK (estado IN ('programada', 'completada', 'cancelada')),
  recordatorio boolean DEFAULT true,
  enlace_reunion text,
  fecha_creacion timestamptz DEFAULT now(),
  fecha_actualizacion timestamptz DEFAULT now()
);

-- Tabla de tickets
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  vendedor_id uuid NOT NULL REFERENCES vendedores(id) ON DELETE CASCADE,
  numero text UNIQUE NOT NULL,
  titulo text NOT NULL,
  descripcion text NOT NULL,
  estado text NOT NULL DEFAULT 'abierto' CHECK (estado IN ('abierto', 'en_proceso', 'resuelto', 'cerrado')),
  prioridad text NOT NULL DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
  categoria text NOT NULL DEFAULT 'general' CHECK (categoria IN ('tecnico', 'facturacion', 'producto', 'servicio', 'general')),
  fecha_creacion timestamptz DEFAULT now(),
  fecha_actualizacion timestamptz DEFAULT now()
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  vendedor_id uuid NOT NULL REFERENCES vendedores(id) ON DELETE CASCADE,
  numero text UNIQUE NOT NULL,
  estado text NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'enviado', 'aprobado', 'rechazado', 'procesando', 'completado')),
  subtotal numeric DEFAULT 0,
  impuestos numeric DEFAULT 0,
  total numeric DEFAULT 0,
  fecha_entrega timestamptz,
  notas text,
  fecha_creacion timestamptz DEFAULT now(),
  fecha_actualizacion timestamptz DEFAULT now()
);

-- Tabla de productos en pedidos
CREATE TABLE IF NOT EXISTS productos_pedido (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  descripcion text,
  cantidad integer NOT NULL DEFAULT 1,
  precio_unitario numeric NOT NULL DEFAULT 0,
  subtotal numeric NOT NULL DEFAULT 0,
  fecha_creacion timestamptz DEFAULT now()
);

-- Tabla de metas mensuales
CREATE TABLE IF NOT EXISTS metas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendedor_id uuid NOT NULL REFERENCES vendedores(id) ON DELETE CASCADE,
  mes integer NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano integer NOT NULL,
  objetivo_ventas numeric DEFAULT 0,
  objetivo_clientes integer DEFAULT 0,
  ventas_actuales numeric DEFAULT 0,
  clientes_actuales integer DEFAULT 0,
  fecha_creacion timestamptz DEFAULT now(),
  fecha_actualizacion timestamptz DEFAULT now(),
  UNIQUE(vendedor_id, mes, ano)
);

-- Tabla de oportunidades (para el pipeline)
CREATE TABLE IF NOT EXISTS oportunidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  vendedor_id uuid NOT NULL REFERENCES vendedores(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descripcion text,
  valor numeric DEFAULT 0,
  probabilidad integer DEFAULT 0 CHECK (probabilidad >= 0 AND probabilidad <= 100),
  etapa text NOT NULL DEFAULT 'inicial' CHECK (etapa IN ('inicial', 'calificado', 'propuesta', 'negociacion', 'cerrado', 'perdido')),
  fecha_cierre_estimada timestamptz,
  fecha_creacion timestamptz DEFAULT now(),
  fecha_actualizacion timestamptz DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE vendedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE reuniones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE oportunidades ENABLE ROW LEVEL SECURITY;

-- Políticas para vendedores (tabla vendedores)
CREATE POLICY "Vendedores pueden ver su propio perfil"
  ON vendedores FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Vendedores pueden actualizar su propio perfil"
  ON vendedores FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins pueden ver todos los vendedores"
  ON vendedores FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendedores 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Políticas para clientes
CREATE POLICY "Vendedores pueden ver sus propios clientes"
  ON clientes FOR SELECT
  TO authenticated
  USING (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden crear clientes"
  ON clientes FOR INSERT
  TO authenticated
  WITH CHECK (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden actualizar sus propios clientes"
  ON clientes FOR UPDATE
  TO authenticated
  USING (vendedor_id = auth.uid());

CREATE POLICY "Admins pueden ver todos los clientes"
  ON clientes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendedores 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Políticas para actividades
CREATE POLICY "Vendedores pueden ver sus propias actividades"
  ON actividades FOR SELECT
  TO authenticated
  USING (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden crear actividades"
  ON actividades FOR INSERT
  TO authenticated
  WITH CHECK (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden actualizar sus propias actividades"
  ON actividades FOR UPDATE
  TO authenticated
  USING (vendedor_id = auth.uid());

-- Políticas para reuniones
CREATE POLICY "Vendedores pueden ver sus propias reuniones"
  ON reuniones FOR SELECT
  TO authenticated
  USING (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden crear reuniones"
  ON reuniones FOR INSERT
  TO authenticated
  WITH CHECK (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden actualizar sus propias reuniones"
  ON reuniones FOR UPDATE
  TO authenticated
  USING (vendedor_id = auth.uid());

-- Políticas para tickets
CREATE POLICY "Vendedores pueden ver sus propios tickets"
  ON tickets FOR SELECT
  TO authenticated
  USING (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden crear tickets"
  ON tickets FOR INSERT
  TO authenticated
  WITH CHECK (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden actualizar sus propios tickets"
  ON tickets FOR UPDATE
  TO authenticated
  USING (vendedor_id = auth.uid());

-- Políticas para pedidos
CREATE POLICY "Vendedores pueden ver sus propios pedidos"
  ON pedidos FOR SELECT
  TO authenticated
  USING (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden crear pedidos"
  ON pedidos FOR INSERT
  TO authenticated
  WITH CHECK (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden actualizar sus propios pedidos"
  ON pedidos FOR UPDATE
  TO authenticated
  USING (vendedor_id = auth.uid());

-- Políticas para productos_pedido
CREATE POLICY "Vendedores pueden ver productos de sus pedidos"
  ON productos_pedido FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pedidos 
      WHERE id = pedido_id AND vendedor_id = auth.uid()
    )
  );

CREATE POLICY "Vendedores pueden crear productos en sus pedidos"
  ON productos_pedido FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pedidos 
      WHERE id = pedido_id AND vendedor_id = auth.uid()
    )
  );

-- Políticas para metas
CREATE POLICY "Vendedores pueden ver sus propias metas"
  ON metas FOR SELECT
  TO authenticated
  USING (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden crear sus propias metas"
  ON metas FOR INSERT
  TO authenticated
  WITH CHECK (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden actualizar sus propias metas"
  ON metas FOR UPDATE
  TO authenticated
  USING (vendedor_id = auth.uid());

-- Políticas para oportunidades
CREATE POLICY "Vendedores pueden ver sus propias oportunidades"
  ON oportunidades FOR SELECT
  TO authenticated
  USING (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden crear oportunidades"
  ON oportunidades FOR INSERT
  TO authenticated
  WITH CHECK (vendedor_id = auth.uid());

CREATE POLICY "Vendedores pueden actualizar sus propias oportunidades"
  ON oportunidades FOR UPDATE
  TO authenticated
  USING (vendedor_id = auth.uid());

-- Función para actualizar timestamp de actualización
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar fecha_actualizacion automáticamente
CREATE TRIGGER update_vendedores_updated_at BEFORE UPDATE ON vendedores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_actividades_updated_at BEFORE UPDATE ON actividades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reuniones_updated_at BEFORE UPDATE ON reuniones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON pedidos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_metas_updated_at BEFORE UPDATE ON metas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_oportunidades_updated_at BEFORE UPDATE ON oportunidades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar números únicos de tickets
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.numero = 'TICK-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD(nextval('ticket_sequence')::text, 4, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Secuencia para números de tickets
CREATE SEQUENCE IF NOT EXISTS ticket_sequence START 1;

-- Trigger para generar número de ticket automáticamente
CREATE TRIGGER generate_ticket_number_trigger 
  BEFORE INSERT ON tickets 
  FOR EACH ROW 
  EXECUTE FUNCTION generate_ticket_number();

-- Función para generar números únicos de pedidos
CREATE OR REPLACE FUNCTION generate_pedido_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.numero = 'PED-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD(nextval('pedido_sequence')::text, 4, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Secuencia para números de pedidos
CREATE SEQUENCE IF NOT EXISTS pedido_sequence START 1;

-- Trigger para generar número de pedido automáticamente
CREATE TRIGGER generate_pedido_number_trigger 
  BEFORE INSERT ON pedidos 
  FOR EACH ROW 
  EXECUTE FUNCTION generate_pedido_number();

-- Función para actualizar última actividad del cliente
CREATE OR REPLACE FUNCTION update_cliente_ultima_actividad()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE clientes 
  SET ultima_actividad = now() 
  WHERE id = NEW.cliente_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar última actividad cuando se crea una actividad
CREATE TRIGGER update_cliente_actividad_trigger 
  AFTER INSERT ON actividades 
  FOR EACH ROW 
  EXECUTE FUNCTION update_cliente_ultima_actividad();

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_clientes_vendedor_id ON clientes(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_clientes_estado ON clientes(estado);
CREATE INDEX IF NOT EXISTS idx_clientes_etapa_venta ON clientes(etapa_venta);
CREATE INDEX IF NOT EXISTS idx_actividades_cliente_id ON actividades(cliente_id);
CREATE INDEX IF NOT EXISTS idx_actividades_vendedor_id ON actividades(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_actividades_fecha ON actividades(fecha);
CREATE INDEX IF NOT EXISTS idx_reuniones_vendedor_id ON reuniones(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_reuniones_fecha_inicio ON reuniones(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_tickets_vendedor_id ON tickets(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON tickets(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_vendedor_id ON pedidos(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_oportunidades_vendedor_id ON oportunidades(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_etapa ON oportunidades(etapa);