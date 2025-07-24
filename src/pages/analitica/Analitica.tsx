import React from 'react';
import { Layout } from '../../components/layout/Layout';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';


export const Analitica: React.FC = () => {


  const metricas = [
    {
      titulo: 'Ventas del Mes',
      valor: '$45,230',
      cambio: '+12%',
      tipo: 'positivo',
      icon: DollarSign,
      color: 'green'
    },
    {
      titulo: 'Nuevos Clientes',
      valor: '24',
      cambio: '+8%',
      tipo: 'positivo',
      icon: Users,
      color: 'blue'
    },
    {
      titulo: 'Tasa de Conversión',
      valor: '18.5%',
      cambio: '+2.3%',
      tipo: 'positivo',
      icon: Target,
      color: 'purple'
    },
    {
      titulo: 'Actividades Completadas',
      valor: '156',
      cambio: '+15%',
      tipo: 'positivo',
      icon: Activity,
      color: 'orange'
    }
  ];

  const ventasPorMes = [
    { mes: 'Ene', ventas: 32000, clientes: 18 },
    { mes: 'Feb', ventas: 28000, clientes: 15 },
    { mes: 'Mar', ventas: 35000, clientes: 22 },
    { mes: 'Abr', ventas: 42000, clientes: 28 },
    { mes: 'May', ventas: 38000, clientes: 24 },
    { mes: 'Jun', ventas: 45000, clientes: 31 }
  ];

  const clientesPorEtapa = [
    { etapa: 'Inicial', cantidad: 12, porcentaje: 20 },
    { etapa: 'Calificado', cantidad: 8, porcentaje: 13 },
    { etapa: 'Propuesta', cantidad: 15, porcentaje: 25 },
    { etapa: 'Negociación', cantidad: 18, porcentaje: 30 },
    { etapa: 'Cerrado', cantidad: 7, porcentaje: 12 }
  ];

  const actividadesPorTipo = [
    { tipo: 'Llamadas', cantidad: 45, porcentaje: 35 },
    { tipo: 'Emails', cantidad: 38, porcentaje: 30 },
    { tipo: 'Reuniones', cantidad: 28, porcentaje: 22 },
    { tipo: 'Tareas', cantidad: 17, porcentaje: 13 }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'orange':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Layout 
      title="Analítica de Ventas"
      subtitle="Métricas y estadísticas de tu rendimiento comercial"
    >
      <div className="space-y-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricas.map((metrica) => (
            <div key={metrica.titulo} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metrica.titulo}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metrica.valor}</p>
                  <p className={`text-sm mt-2 ${
                    metrica.tipo === 'positivo' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metrica.cambio} vs mes anterior
                  </p>
                </div>
                <div className={`p-3 rounded-full ${getColorClasses(metrica.color)}`}>
                  <metrica.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de ventas mensuales */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Ventas Mensuales</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {ventasPorMes.map((mes) => (
                <div key={mes.mes} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 w-8">{mes.mes}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(mes.ventas / 50000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${mes.ventas.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{mes.clientes} clientes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline por etapas */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Pipeline por Etapas</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {clientesPorEtapa.map((etapa, index) => (
                <div key={etapa.etapa} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-gray-400' :
                      index === 1 ? 'bg-blue-400' :
                      index === 2 ? 'bg-yellow-400' :
                      index === 3 ? 'bg-orange-400' :
                      'bg-green-400'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{etapa.etapa}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-gray-400' :
                          index === 1 ? 'bg-blue-400' :
                          index === 2 ? 'bg-yellow-400' :
                          index === 3 ? 'bg-orange-400' :
                          'bg-green-400'
                        }`}
                        style={{ width: `${etapa.porcentaje * 2}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">
                      {etapa.cantidad}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actividades por tipo */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Actividades por Tipo</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {actividadesPorTipo.map((actividad, index) => (
                <div key={actividad.tipo} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-400' :
                      index === 1 ? 'bg-green-400' :
                      index === 2 ? 'bg-purple-400' :
                      'bg-orange-400'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{actividad.tipo}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-400' :
                          index === 1 ? 'bg-green-400' :
                          index === 2 ? 'bg-purple-400' :
                          'bg-orange-400'
                        }`}
                        style={{ width: `${actividad.porcentaje * 2}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">
                      {actividad.cantidad}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metas mensuales */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Progreso de Metas</h3>
              <Target className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Meta de Ventas</span>
                  <span className="text-sm font-semibold text-gray-900">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$45,230</span>
                  <span>$58,000</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Meta de Clientes</span>
                  <span className="text-sm font-semibold text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>24 clientes</span>
                  <span>28 clientes</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Meta de Actividades</span>
                  <span className="text-sm font-semibold text-gray-900">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-500 h-3 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>156 actividades</span>
                  <span>170 actividades</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de rendimiento */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumen de Rendimiento</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">+18%</p>
              <p className="text-sm text-gray-600">Crecimiento en ventas</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">24</p>
              <p className="text-sm text-gray-600">Nuevos clientes este mes</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">156</p>
              <p className="text-sm text-gray-600">Actividades completadas</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};