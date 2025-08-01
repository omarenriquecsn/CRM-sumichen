import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSupabase } from "../../hooks/useSupabase";
import { useAuth } from "../../context/useAuth";
import {
  ArrowLeft,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Tag,
  List,
  MessageSquare,
} from "lucide-react";
import { Layout } from "../../components/layout/Layout";
import { ConfirmarAccionToast } from "../../components/ui/ConfirmarAccionToast";
import dayjs from "dayjs";

const TicketDetail = () => {
  const { id } = useParams();
  const supabase = useSupabase();
  const { currentUser } = useAuth();
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] =
    useState(false);

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

  // Actualizar Ticket
  const { mutate: actualizarTicket, isPending: isUpdatingTicket } =
    supabase.useActualizarTicket();

  const prepararResolverTicket = () => {
    if (!ticket) return;
    setMostrarModalConfirmacion(true);
  };

  const handleResolverTicket = () => {
    if (!currentUser) {
      toast.error("Debes iniciar sesión para realizar esta acción.");
      return;
    }
    if (!ticket) {
      toast.error("No se pudo encontrar el ticket para actualizar.");
      return;
    }

    actualizarTicket(
      {
        TicketData: { id: ticket.id, estado: "resuelto", fecha_actualizacion: new Date() },
        currentUser,
      },
      {
        onSuccess: () => {
          toast.success("¡Ticket marcado como resuelto!");
          setMostrarModalConfirmacion(false);
        },
        onError: (error) => {
          toast.error(`Error al resolver el ticket: ${error.message}`);
          setMostrarModalConfirmacion(false);
        },
      }
    );
  };

  if (errorTickets || errorClientes) {
    toast.error("Error al cargar el tickets");
    return;
  }

  if (loadingTickets || loadingClientes) {
    return <p>Cargando...</p>;
  }

  if (!tickets || !clientes) {
    toast.error("Tickets no encontrado");
    return;
  }

  const ticket = tickets.find((ticket) => ticket.id === id);
  const clientesMap = new Map(clientes.map((cliente) => [cliente.id, cliente]));

  if (!ticket) {
    toast.error("Ticket no encontrado");
    return;
  }

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
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoIcon = (estado: string) => {
    const iconProps = { className: "h-8 w-8" };
    switch (estado) {
      case "abierto":
        return <AlertCircle {...iconProps} />;
      case "en_proceso":
        return <Clock {...iconProps} />;
      case "resuelto":
        return <CheckCircle {...iconProps} />;
      case "cerrado":
        return <XCircle {...iconProps} />;
      default:
        return <AlertCircle {...iconProps} />;
    }
  };

  return (
    <Layout
      title="Ticket de Soporte"
      subtitle="Gestiona la solicitud y problema del cliente"
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/tickets"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver a Tickets</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-full ${getEstadoColor(
                      ticket.estado
                    )}`}
                  >
                    {getEstadoIcon(ticket.estado)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {ticket.titulo}
                    </h2>
                    <p className="text-gray-600">Ticket #{ticket.numero}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getEstadoColor(
                    ticket.estado
                  )}`}
                >
                  {ticket.estado.replace("_", " ")}
                </span>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {ticket.descripcion}
                </p>
              </div>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalles
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Cliente</p>
                    <p className="font-medium text-gray-900">
                      {clientesMap.get(ticket.cliente_id)?.nombre}{" "}
                      {clientesMap.get(ticket.cliente_id)?.apellido}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Tag className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Prioridad</p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${getPrioridadColor(
                        ticket.prioridad
                      )}`}
                    >
                      {ticket.prioridad}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <List className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Categoría</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {ticket.categoria}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Creado</p>
                    <p className="font-medium text-gray-900">
                      {dayjs(ticket.fecha_creacion).format("DD/MM/YYYY HH:mm")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Última actualización</p>
                    <p className="font-medium text-gray-900">
                      {dayjs(ticket.fecha_actualizacion).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Acciones
              </h3>
              <div className="space-y-3">
                {ticket.estado !== "resuelto" && ticket.estado !== "cerrado" && (
                  <button
                    onClick={prepararResolverTicket}
                    disabled={isUpdatingTicket}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-green-300 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>
                      {isUpdatingTicket
                        ? "Resolviendo..."
                        : "Marcar como Resuelto"}
                    </span>
                  </button>
                )}
                <button className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Añadir Comentario</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmarAccionToast
        visible={mostrarModalConfirmacion}
        setVisible={setMostrarModalConfirmacion}
        onConfirm={handleResolverTicket}
        texto="¿Estás seguro de que deseas resolver este ticket?"
        posicion="bottom-right"
        tema="dark"
        modoModal={true}
      />
    </Layout>
  );
};

export default TicketDetail;
