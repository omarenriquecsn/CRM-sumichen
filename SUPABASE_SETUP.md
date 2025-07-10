# 🚀 Configuración de Supabase para CRM Pro

## 📋 Pasos para configurar Supabase

### 1. Crear proyecto en Supabase
1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Haz clic en "New Project"
3. Selecciona tu organización
4. Ingresa el nombre del proyecto: `crm-pro`
5. Crea una contraseña segura para la base de datos
6. Selecciona la región más cercana a tus usuarios
7. Haz clic en "Create new project"

### 2. Obtener las credenciales
1. Una vez creado el proyecto, ve a **Settings** > **API**
2. Encontrarás dos valores importantes:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **anon/public key**: Una clave larga que empieza con `eyJhbGciOiJIUzI1NiIs...`

### 3. Configurar variables de entorno
1. Copia el archivo `.env.example` a `.env`
2. Reemplaza los valores:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4. Ejecutar migraciones
Las migraciones ya están creadas en `supabase/migrations/`. Para aplicarlas:

#### Opción A: Usando el Dashboard de Supabase
1. Ve a **SQL Editor** en tu dashboard de Supabase
2. Copia y pega el contenido de `supabase/migrations/20250706223753_still_sky.sql`
3. Ejecuta la consulta
4. Repite con `supabase/migrations/20250706223850_fierce_firefly.sql`

#### Opción B: Usando Supabase CLI (recomendado)
```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar proyecto
supabase init

# Configurar conexión
supabase link --project-ref tu-project-ref

# Aplicar migraciones
supabase db push
```

### 5. Configurar autenticación
1. Ve a **Authentication** > **Settings**
2. En **Site URL**, agrega: `http://localhost:5173`
3. En **Redirect URLs**, agrega: `http://localhost:5173/**`
4. Habilita **Email confirmations** si lo deseas (opcional)

### 6. Configurar Row Level Security (RLS)
Las políticas de RLS ya están configuradas en las migraciones. Esto asegura que:
- ✅ Cada vendedor solo ve sus propios clientes
- ✅ Los administradores pueden ver todos los datos
- ✅ Los datos están protegidos automáticamente

## 🔧 Estructura de la Base de Datos

El CRM incluye las siguientes tablas:

- **vendedores**: Perfiles de usuarios (vendedores y admins)
- **clientes**: Información de clientes y prospectos
- **actividades**: Registro de llamadas, emails, reuniones, etc.
- **reuniones**: Programación de citas y reuniones
- **tickets**: Sistema de soporte y reclamos
- **pedidos**: Gestión de órdenes de compra
- **productos_pedido**: Detalles de productos en pedidos
- **metas**: Objetivos mensuales de vendedores
- **oportunidades**: Pipeline de ventas

## 🎯 Primeros Pasos

1. **Registra tu primera cuenta**: Ve a `/register`
2. **Crea datos de ejemplo**: Ejecuta en SQL Editor:
   ```sql
   SELECT insert_sample_data('tu-user-id');
   ```
3. **Explora el CRM**: ¡Ya puedes usar todas las funcionalidades!

## 🔒 Seguridad

- ✅ **Row Level Security** habilitado
- ✅ **Políticas automáticas** por vendedor
- ✅ **Autenticación segura** con Supabase Auth
- ✅ **Validaciones** en frontend y backend

## 📞 Soporte

Si tienes problemas:
1. Verifica que las variables de entorno estén correctas
2. Asegúrate de que las migraciones se ejecutaron
3. Revisa la consola del navegador para errores
4. Verifica los logs en el dashboard de Supabase