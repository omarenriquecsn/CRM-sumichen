import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../context/useAuth';
import {
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const DashboardVendedor: React.FC = () => {
  const { userData } = useAuth();

  const stats = [
    {
      title: 'Clientes Activos',
      value: '24',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Ventas del Mes',
      value: '$45,230',
      change: '+8%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Pipeline',
      value: '$128,500',
      change: '+15%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Meta Mensual',
      value: '78%',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Target,
      color: 'orange'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'reunion',
      title: 'Reunión con Empresa ABC',
      time: 'Hace 2 horas',
      status: 'completada'
    },
    {
      id: 2,
      type: 'llamada',
      title: 'Llamada de seguimiento - Cliente XYZ',
      time: 'Hace 4 horas',
      status: 'completada'
    },
    {
      id: 3,
      type: 'email',
      title: 'Propuesta enviada a Corporativo 123',
      time: 'Ayer',
      status: 'pendiente'
    },
    {
      id: 4,
      type: 'tarea',
      title: 'Preparar presentación Q1',
      time: 'Hace 2 días',
      status: 'vencida'
    }
  ];

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Demo de producto - TechCorp',
      time: '14:00',
      date: 'Hoy',
      client: 'TechCorp S.A.'
    },
    {
      id: 2,
      title: 'Seguimiento de propuesta',
      time: '10:30',
      date: 'Mañana',
      client: 'Innovación Digital'
    },
    {
      id: 3,
      title: 'Reunión de cierre',
      time: '16:00',
      date: 'Viernes',
      client: 'Soluciones Empresariales'
    }
  ];

  return (
    <Layout 
      title={`¡Bienvenido, ${userData?.nombre}!`}
      subtitle="Aquí tienes un resumen de tu actividad de ventas"
    >
      <div className="space-y-6">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
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
          {/* Actividades recientes */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividades Recientes</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'completada' ? 'bg-green-100' :
                    activity.status === 'pendiente' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    {activity.status === 'completada' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : activity.status === 'pendiente' ? (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Próximas reuniones */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Reuniones</h3>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{meeting.title}</p>
                    <p className="text-sm text-gray-500">{meeting.client}</p>
                    <p className="text-sm text-blue-600">{meeting.date} a las {meeting.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico de rendimiento */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento de Ventas</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Gráfico de ventas mensuales (próximamente)</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};