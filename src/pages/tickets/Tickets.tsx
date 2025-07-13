import React, { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import {
  Plus,
  Search,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useSupabase } from "../../hooks/useSupabase";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export const Tickets: React.FC = () => {
  const supabase = useSupabase();
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("todas");

// tickets
  const {
    data: tickets,
    isLoading: loadingTickets,
    error: errorTickets,
  } = supabase.useTickets();

  // clientes
  const {
    data: clientes,
    isLoading: loadingClientes,
    error: errorClientes,
  } = supabase.useClientes();



  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "abierto":
        return "bg-red-100 text-red-800";
      case "en_proceso":
        return "bg-yellow-100 text-yellow-800";
      case "resuelto":
        return "bg-green-100 text-green-800";
      case "cerrado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "urgente":
        return "bg-red-100 text-red-800 border-red-200";
      case "alta":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baja":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "tecnico":
        return "bg-blue-100 text-blue-800";
      case "facturacion":
        return "bg-purple-100 text-purple-800";
      case "producto":
        return "bg-indigo-100 text-indigo-800";
      case "servicio":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "abierto":
        return <AlertCircle className="h-4 w-4" />;
      case "en_proceso":
        return <Clock className="h-4 w-4" />;
      case "resuelto":
        return <CheckCircle className="h-4 w-4" />;
      case "cerrado":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (errorTickets || errorClientes) {
    toast.error("Error al cargar los tickets");
    return;
  }

  if (loadingTickets || loadingClientes) {
    return <p>Cargando...</p>;
  }

  if (!tickets || !clientes) {
    return <p>No hay tickets</p>;
  }

  const clientesMap = new Map(clientes.map((cliente) => [cliente.id, cliente]));


  const ticketsFiltrados = tickets.filter((ticket) => {
    const matchesEstado =
      filtroEstado === "todos" || ticket.estado === filtroEstado;
    const matchesPrioridad =
      filtroPrioridad === "todas" || ticket.prioridad === filtroPrioridad;
    return matchesEstado && matchesPrioridad;
  });

  const estadisticas = {
    total: tickets.length,
    abiertos: tickets.filter((t) => t.estado === "abierto").length,
    enProceso: tickets.filter((t) => t.estado === "en_proceso").length,
    resueltos: tickets.filter((t) => t.estado === "resuelto").length,
    urgentes: tickets.filter((t) => t.prioridad === "urgente").length,
  };

  return (
    <Layout
      title="Tickets de Soporte"
      subtitle="Gestiona las solicitudes y problemas de tus clientes"
    >
      <div className="space-y-6">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {estadisticas.total}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">
                Abiertos
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {estadisticas.abiertos}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">
                En Proceso
              </span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {estadisticas.enProceso}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">
                Resueltos
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {estadisticas.resueltos}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">
                Urgentes
              </span>
            </div>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {estadisticas.urgentes}
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
                placeholder="Buscar tickets..."
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
                <option value="abierto">Abiertos</option>
                <option value="en_proceso">En Proceso</option>
                <option value="resuelto">Resueltos</option>
                <option value="cerrado">Cerrados</option>
              </select>

              <select
                value={filtroPrioridad}
                onChange={(e) => setFiltroPrioridad(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todas">Todas las prioridades</option>
                <option value="urgente">Urgente</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>

          {/* Botón nuevo ticket */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Nuevo Ticket</span>
          </button>
        </div>

        {/* Lista de tickets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Ticket
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Cliente
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Estado
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Prioridad
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Categoría
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Fecha
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ticketsFiltrados.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-lg ${getEstadoColor(
                            ticket.estado
                          )}`}
                        >
                          {getEstadoIcon(ticket.estado)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {ticket.titulo}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1 max-w-md">
                            {ticket.descripcion}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {clientesMap.get(ticket.cliente_id)?.nombre ??
                              "Cliente"}
                            {" "}
                            {clientesMap.get(ticket.cliente_id)?.apellido ??
                              "Cliente"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {ticket.contacto}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getEstadoColor(
                          ticket.estado
                        )}`}
                      >
                        {ticket.estado.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getPrioridadColor(
                          ticket.prioridad
                        )}`}
                      >
                        {ticket.prioridad}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCategoriaColor(
                          ticket.categoria
                        )}`}
                      >
                        {ticket.categoria}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {dayjs(ticket.fecha_actualizacion).format(
                              "DD/MM/YYYY"
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Actualizado:{" "}
                          {dayjs(ticket.fecha_actualizacion).format(
                            "DD/MM/YYYY"
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Ver
                        </button>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          Resolver
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};
