import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Filter,
  Search,
  Video,
  Phone,
  Users
} from 'lucide-react';

export const Reuniones: React.FC = () => {
  const [vistaActual, setVistaActual] = useState<'lista' | 'calendario'>('lista');
  const [filtroEstado, setFiltroEstado] = useState('todas');

  const reuniones = [
    {
      id: '1',
      titulo: 'Demo de producto - TechCorp',
      descripcion: 'Presentación de la nueva plataforma de automatización',
      cliente: 'TechCorp S.A.',
      contacto: 'Ana García',
      fechaInicio: new Date('2024-01-16T14:00:00'),
      fechaFin: new Date('2024-01-16T15:00:00'),
      ubicacion: 'Oficina TechCorp - Sala de Juntas A',
      estado: 'programada',
      tipo: 'presencial',
      recordatorio: true
    },
    {
      id: '2',
      titulo: 'Seguimiento de propuesta',
      descripcion: 'Revisión de feedback y ajustes a la propuesta comercial',
      cliente: 'Innovación Digital',
      contacto: 'Carlos López',
      fechaInicio: new Date('2024-01-17T10:30:00'),
      fechaFin: new Date('2024-01-17T11:30:00'),
      ubicacion: 'Videollamada - Google Meet',
      estado: 'programada',
      tipo: 'virtual',
      recordatorio: true
    },
    {
      id: '3',
      titulo: 'Reunión de cierre',
      descripcion: 'Firma de contrato y definición de próximos pasos',
      cliente: 'Soluciones Empresariales',
      contacto: 'María Rodríguez',
      fechaInicio: new Date('2024-01-19T16:00:00'),
      fechaFin: new Date('2024-01-19T17:00:00'),
      ubicacion: 'Oficina Central - Sala de Juntas 3',
      estado: 'programada',
      tipo: 'presencial',
      recordatorio: true
    },
    {
      id: '4',
      titulo: 'Reunión de seguimiento post-venta',
      descripcion: 'Evaluación de satisfacción y oportunidades adicionales',
      cliente: 'Global Tech',
      contacto: 'Fernando López',
      fechaInicio: new Date('2024-01-12T11:00:00'),
      fechaFin: new Date('2024-01-12T12:00:00'),
      ubicacion: 'Llamada telefónica',
      estado: 'completada',
      tipo: 'telefonica',
      recordatorio: false
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'programada':
        return 'bg-blue-100 text-blue-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'virtual':
        return <Video className="h-4 w-4" />;
      case 'telefonica':
        return <Phone className="h-4 w-4" />;
      case 'presencial':
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const reunionesFiltradas = reuniones.filter(reunion => {
    if (filtroEstado === 'todas') return true;
    return reunion.estado === filtroEstado;
  });

  const proximasReuniones = reuniones
    .filter(r => r.estado === 'programada' && r.fechaInicio > new Date())
    .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime())
    .slice(0, 3);

  return (
    <Layout 
      title="Gestión de Reuniones"
      subtitle="Programa y gestiona tus reuniones con clientes"
    >
      <div className="space-y-6">
        {/* Barra de herramientas */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar reuniones..."
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
                <option value="todas">Todas las reuniones</option>
                <option value="programada">Programadas</option>
                <option value="completada">Completadas</option>
                <option value="cancelada">Canceladas</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Selector de vista */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setVistaActual('lista')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  vistaActual === 'lista'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setVistaActual('calendario')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  vistaActual === 'calendario'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Calendario
              </button>
            </div>
            
            {/* Botón nueva reunión */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Nueva Reunión</span>
            </button>
          </div>
        </div>

        {/* Próximas reuniones */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Reuniones</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {proximasReuniones.map((reunion) => (
              <div key={reunion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getTipoIcon(reunion.tipo)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{reunion.titulo}</h4>
                      <p className="text-xs text-gray-500">{reunion.cliente}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{reunion.fechaInicio.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {reunion.fechaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {reunion.fechaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{reunion.ubicacion}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de reuniones */}
        {vistaActual === 'lista' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Reunión</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Cliente</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Fecha y Hora</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Ubicación</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reunionesFiltradas.map((reunion) => (
                    <tr key={reunion.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getTipoIcon(reunion.tipo)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{reunion.titulo}</h4>
                            <p className="text-sm text-gray-500">{reunion.descripcion}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{reunion.cliente}</p>
                            <p className="text-sm text-gray-500">{reunion.contacto}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {reunion.fechaInicio.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {reunion.fechaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                              {reunion.fechaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{reunion.ubicacion}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getEstadoColor(reunion.estado)}`}>
                          {reunion.estado}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vista de calendario */}
        {vistaActual === 'calendario' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Vista de Calendario</h3>
                <p className="text-gray-500">La vista de calendario estará disponible próximamente</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};