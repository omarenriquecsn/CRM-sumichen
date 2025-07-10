import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import {
  Plus,
  Search,
  Filter,
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';

export const Pedidos: React.FC = () => {
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const pedidos = [
    {
      id: '1',
      numero: 'PED-2024-001',
      cliente: 'TechCorp S.A.',
      contacto: 'Ana García',
      productos: [
        { id: '1', nombre: 'Licencia Software Pro', cantidad: 5, precio: 2500, subtotal: 12500 },
        { id: '2', nombre: 'Soporte Técnico Anual', cantidad: 1, precio: 5000, subtotal: 5000 }
      ],
      total: 17500,
      estado: 'aprobado',
      fechaCreacion: new Date('2024-01-15T10:30:00'),
      fechaEntrega: new Date('2024-01-25T00:00:00'),
      notas: 'Entrega urgente solicitada por el cliente'
    },
    {
      id: '2',
      numero: 'PED-2024-002',
      cliente: 'Innovación Digital',
      contacto: 'Carlos López',
      productos: [
        { id: '3', nombre: 'Módulo CRM Avanzado', cantidad: 1, precio: 8500, subtotal: 8500 },
        { id: '4', nombre: 'Capacitación Personalizada', cantidad: 2, precio: 1200, subtotal: 2400 }
      ],
      total: 10900,
      estado: 'enviado',
      fechaCreacion: new Date('2024-01-14T14:20:00'),
      fechaEntrega: new Date('2024-01-28T00:00:00'),
      notas: 'Incluye instalación y configuración inicial'
    },
    {
      id: '3',
      numero: 'PED-2024-003',
      cliente: 'Soluciones Empresariales',
      contacto: 'María Rodríguez',
      productos: [
        { id: '5', nombre: 'Sistema Integrado Completo', cantidad: 1, precio: 25000, subtotal: 25000 },
        { id: '6', nombre: 'Migración de Datos', cantidad: 1, precio: 3500, subtotal: 3500 }
      ],
      total: 28500,
      estado: 'procesando',
      fechaCreacion: new Date('2024-01-13T09:15:00'),
      fechaEntrega: new Date('2024-02-15T00:00:00'),
      notas: 'Proyecto de implementación completa'
    },
    {
      id: '4',
      numero: 'PED-2024-004',
      cliente: 'Global Tech',
      contacto: 'Fernando López',
      productos: [
        { id: '7', nombre: 'Licencia Básica', cantidad: 10, precio: 500, subtotal: 5000 }
      ],
      total: 5000,
      estado: 'completado',
      fechaCreacion: new Date('2024-01-10T16:45:00'),
      fechaEntrega: new Date('2024-01-20T00:00:00'),
      notas: 'Pedido estándar completado exitosamente'
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'borrador':
        return 'bg-gray-100 text-gray-800';
      case 'enviado':
        return 'bg-blue-100 text-blue-800';
      case 'aprobado':
        return 'bg-green-100 text-green-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      case 'procesando':
        return 'bg-yellow-100 text-yellow-800';
      case 'completado':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'borrador':
        return <FileText className="h-4 w-4" />;
      case 'enviado':
        return <Package className="h-4 w-4" />;
      case 'aprobado':
        return <CheckCircle className="h-4 w-4" />;
      case 'rechazado':
        return <XCircle className="h-4 w-4" />;
      case 'procesando':
        return <Clock className="h-4 w-4" />;
      case 'completado':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <ShoppingCart className="h-4 w-4" />;
    }
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    if (filtroEstado === 'todos') return true;
    return pedido.estado === filtroEstado;
  });

  const estadisticas = {
    total: pedidos.length,
    enviados: pedidos.filter(p => p.estado === 'enviado').length,
    aprobados: pedidos.filter(p => p.estado === 'aprobado').length,
    procesando: pedidos.filter(p => p.estado === 'procesando').length,
    completados: pedidos.filter(p => p.estado === 'completado').length,
    valorTotal: pedidos.reduce((sum, p) => sum + p.total, 0)
  };

  return (
    <Layout 
      title="Gestión de Pedidos"
      subtitle="Administra las solicitudes de pedidos de tus clientes"
    >
      <div className="space-y-6">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{estadisticas.total}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Enviados</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-2">{estadisticas.enviados}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Aprobados</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">{estadisticas.aprobados}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Procesando</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{estadisticas.procesando}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-600">Completados</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{estadisticas.completados}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Valor Total</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">
              ${estadisticas.valorTotal.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Barra de herramientas */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar pedidos..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            
            {/* Filtros */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos los estados</option>
                <option value="borrador">Borradores</option>
                <option value="enviado">Enviados</option>
                <option value="aprobado">Aprobados</option>
                <option value="rechazado">Rechazados</option>
                <option value="procesando">Procesando</option>
                <option value="completado">Completados</option>
              </select>
            </div>
          </div>
          
          {/* Botón nuevo pedido */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Nuevo Pedido</span>
          </button>
        </div>

        {/* Lista de pedidos */}
        <div className="space-y-4">
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${getEstadoColor(pedido.estado)}`}>
                    {getEstadoIcon(pedido.estado)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{pedido.numero}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{pedido.cliente}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {pedido.fechaCreacion.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getEstadoColor(pedido.estado)}`}>
                    {pedido.estado}
                  </span>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    ${pedido.total.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Productos */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Productos</h4>
                <div className="space-y-2">
                  {pedido.productos.map((producto) => (
                    <div key={producto.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{producto.nombre}</p>
                        <p className="text-sm text-gray-500">
                          Cantidad: {producto.cantidad} × ${producto.precio.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${producto.subtotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información adicional */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contacto</p>
                    <p className="text-gray-900">{pedido.contacto}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fecha de Entrega</p>
                    <p className="text-gray-900">{pedido.fechaEntrega?.toLocaleDateString()}</p>
                  </div>
                </div>
                
                {pedido.notas && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600">Notas</p>
                    <p className="text-gray-900 mt-1">{pedido.notas}</p>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Ver Detalles
                    </button>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                      Editar
                    </button>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      Duplicar
                    </button>
                  </div>
                  
                  {pedido.estado === 'enviado' && (
                    <div className="flex items-center space-x-2">
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        Aprobar
                      </button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};