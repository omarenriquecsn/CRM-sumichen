import React from 'react';
import { Layout } from '../../components/layout/Layout';
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Award,
  AlertTriangle,
  UserCheck,
  BarChart3
} from 'lucide-react';

export const DashboardAdmin: React.FC = () => {
  const globalStats = [
    {
      title: 'Total Vendedores',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Ventas Totales',
      value: '$542,300',
      change: '+18%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Clientes Activos',
      value: '1,247',
      change: '+156',
      changeType: 'positive' as const,
      icon: UserCheck,
      color: 'purple'
    },
    {
      title: 'Meta Global',
      value: '85%',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Target,
      color: 'orange'
    }
  ];

  const topVendedores = [
    {
      id: 1,
      nombre: 'Ana García',
      ventas: '$45,230',
      clientes: 24,
      meta: 95,
      avatar: 'AG'
    },
    {
      id: 2,
      nombre: 'Carlos López',
      ventas: '$38,750',
      clientes: 19,
      meta: 88,
      avatar: 'CL'
    },
    {
      id: 3,
      nombre: 'María Rodríguez',
      ventas: '$35,600',
      clientes: 22,
      meta: 82,
      avatar: 'MR'
    },
    {
      id: 4,
      nombre: 'Juan Martínez',
      ventas: '$32,100',
      clientes: 18,
      meta: 78,
      avatar: 'JM'
    }
  ];

  const alertas = [
    {
      id: 1,
      tipo: 'meta',
      mensaje: '3 vendedores están por debajo del 70% de su meta mensual',
      urgencia: 'alta'
    },
    {
      id: 2,
      tipo: 'actividad',
      mensaje: '5 clientes sin actividad en los últimos 15 días',
      urgencia: 'media'
    },
    {
      id: 3,
      tipo: 'ticket',
      mensaje: '8 tickets de soporte pendientes de resolución',
      urgencia: 'alta'
    }
  ];

  return (
    <Layout 
      title="Panel de Administración"
      subtitle="Vista general del rendimiento del equipo de ventas"
    >
      <div className="space-y-6">
        {/* Estadísticas globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {globalStats.map((stat) => (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-2 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} vs mes anterior
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'purple' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top vendedores */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Vendedores</h3>
              <Award className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="space-y-4">
              {topVendedores.map((vendedor, index) => (
                <div key={vendedor.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-bold ${
                      index === 0 ? 'text-yellow-600' :
                      index === 1 ? 'text-gray-500' :
                      index === 2 ? 'text-orange-600' :
                      'text-gray-400'
                    }`}>
                      #{index + 1}
                    </span>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {vendedor.avatar}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{vendedor.nombre}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{vendedor.ventas}</span>
                      <span>•</span>
                      <span>{vendedor.clientes} clientes</span>
                      <span>•</span>
                      <span className={`font-medium ${
                        vendedor.meta >= 90 ? 'text-green-600' :
                        vendedor.meta >= 75 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {vendedor.meta}% meta
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alertas y notificaciones */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Alertas del Sistema</h3>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="space-y-4">
              {alertas.map((alerta) => (
                <div key={alerta.id} className={`p-4 rounded-lg border-l-4 ${
                  alerta.urgencia === 'alta' ? 'bg-red-50 border-red-400' :
                  'bg-yellow-50 border-yellow-400'
                }`}>
                  <p className={`font-medium ${
                    alerta.urgencia === 'alta' ? 'text-red-800' : 'text-yellow-800'
                  }`}>
                    {alerta.mensaje}
                  </p>
                  <p className={`text-sm mt-1 ${
                    alerta.urgencia === 'alta' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    Urgencia: {alerta.urgencia}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráficos de rendimiento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Mes</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de ventas mensuales</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Vendedor</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Comparativa de rendimiento</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};