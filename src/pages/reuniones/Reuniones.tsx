import React, { useState } from "react";
import { Layout } from "../../components/layout/Layout";
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
  Users,
} from "lucide-react";
import { useSupabase } from "../../hooks/useSupabase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { IFormReunion, Reunion } from "../../types";
import Modal from "../../components/ui/Modal";
import CrearReunion from "../../components/forms/CrearReunion";
import Select from "react-select";
import { ConfirmarAccionToast } from "../../components/ui/ConfirmarAccionToast";

export const Reuniones: React.FC = () => {
  const supabase = useSupabase();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [vistaActual, setVistaActual] = useState<"lista" | "calendario">(
    "lista"
  );
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [isModalReunion, setModalReunion] = useState(false);
  const [reunionSeleccionada, setReunionSeleccionada] =
    useState<Reunion | null>(null);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [reunionIdSeleccionada, setReunionIdSeleccionada] = useState<
    string | null
  >(null);

  const [modalClienteVisible, setModalClienteVisible] = useState(false);
  const [modalReunionVisible, setModalReunionVisible] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string | null>(
    null
  );

  //Reuniones
  const {
    data: reuniones,
    isLoading: loadinReuniones,
    error: errorsReuniones,
  } = supabase.useReuniones();
  //Clientes
  const {
    data: clientes,
    isLoading: loadingClientes,
    error: errorClientes,
  } = supabase.useClientes();
  //Actualizar Reuniones

  const { mutate: actualizarReunion, isPending: pendingReunion } =
    supabase.useActualizarReunion();

  //Crear Reuniones

  const { mutate: crearReunion, isPending: pendingCrearReunion } =
    supabase.useCrearReunion();

  if (loadinReuniones || loadingClientes) {
    return <p>Cargando ...</p>;
  }

  if (errorsReuniones || errorClientes) {
    toast.error("Error al cargar las reuniones ");
    navigate("/dasboard");
    return;
  }

  if (!reuniones || !clientes) {
    <p>nada para mostrar</p>;
    return;
  }

  const CreandoReunion = (data: IFormReunion) => {
    if (!currentUser) {
      toast.error("Usuario no logueado");
      navigate("/login");
      return;
    }

    if (!clienteSeleccionado) {
      toast.error("No hay cliente seleccionada para editar");
      return;
    }

    const { fecha, inicio, fin, ...rest } = data;

    const fecha_inicio = dayjs(fecha)
      .hour(Number(inicio.split(":")[0]))
      .minute(Number(inicio.split(":")[1]))
      .second(0)
      .millisecond(0)
      .toISOString();

    const fecha_fin = dayjs(fecha)
      .hour(Number(fin.split(":")[0]))
      .minute(Number(fin.split(":")[1]))
      .second(0)
      .millisecond(0)
      .toISOString();

    const newReunion = {
      ...rest,
      cliente_id: clienteSeleccionado,
      fecha_inicio: new Date(fecha_inicio),
      fecha_fin: new Date(fecha_fin),
    };
    console.log(newReunion);
    crearReunion(
      {
        reunionData: newReunion,
        currentUser,
      },
      {
        onSuccess: () => {
          toast.success("Reunion editada con exito");
          setModalReunion(false);
        },
        onError: () => {
          toast.error("Error al editar la reunion");
          return;
        },
      }
    );
  };

  const handleCliente = (cliente_id: string) => {
    return clientes.find((c) => c.id === cliente_id);
  };

  const CambiarReunion = (data: IFormReunion) => {
    if (!currentUser) {
      toast.error("Usuario no logueado");
      navigate("/login");
      return;
    }
    if (!reunionSeleccionada) {
      toast.error("No hay reunión seleccionada para editar");
      return;
    }

    const { fecha, inicio, fin, ...rest } = data;

    const fecha_inicio = dayjs(fecha)
      .hour(Number(inicio.split(":")[0]))
      .minute(Number(inicio.split(":")[1]))
      .second(0)
      .millisecond(0)
      .toISOString();

    const fecha_fin = dayjs(fecha)
      .hour(Number(fin.split(":")[0]))
      .minute(Number(fin.split(":")[1]))
      .second(0)
      .millisecond(0)
      .toISOString();

    const newReunion = {
      ...rest,
      id: reunionSeleccionada.id, // Aseguramos que el id esté presente
      fecha_inicio: new Date(fecha_inicio),
      fecha_fin: new Date(fecha_fin),
    };
    console.log(newReunion);

    actualizarReunion(
      {
        ReunionData: newReunion,
        currentUser,
      },
      {
        onSuccess: () => {
          toast.success("Reunion editada con exito");
          setModalReunion(false);
        },
        onError: () => {
          toast.error("Error al editar la reunion");
          return;
        },
      }
    );
  };

  const handleActualizarReunion = (data: Partial<Reunion>) => {
    if (!currentUser) {
      toast.error("Usuario no logueado");
      navigate("/login");
      return;
    }

    actualizarReunion(
      {
        ReunionData: data,
        currentUser,
      },
      {
        onSuccess: () => {
          toast.success("Reunion Actualizada");
          setModalReunion(false);
        },
        onError: () => {
          toast.error("Error editando la reunion");
        },
      }
    );
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "programada":
        return "bg-blue-100 text-blue-800";
      case "completada":
        return "bg-green-100 text-green-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "virtual":
        return <Video className="h-4 w-4" />;
      case "telefonica":
        return <Phone className="h-4 w-4" />;
      case "presencial":
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const prepararCancelacion = (reunion_id: string) => {
    setReunionIdSeleccionada(reunion_id);
    setMostrarToast(true); // Aquí solo se lanza el toast
  };

  // confirma Cancelar reunion

  const confirmarCancelacion = () => {
    if (!reunionIdSeleccionada) return;

    const laReunionEditada = reuniones.find(
      (r) => r.id === reunionIdSeleccionada
    );
    if (!laReunionEditada) return;

    const { clientes, ...rest } = laReunionEditada;
    rest.estado = "cancelada";
    console.log(clientes);
    handleActualizarReunion(rest);

    setMostrarToast(false);
    setReunionIdSeleccionada(null);
  };

  // filtros
  const reunionesFiltradas = reuniones.filter((reunion) => {
    if (filtroEstado === "todas") return true;
    return reunion.estado === filtroEstado;
  });

  const proximasReuniones = reuniones
    .filter(
      (r) =>
        r.estado === "programada" &&
        r.fecha_inicio > new Date().toLocaleString()
    )
    // .sort((a, b) => a.fecha_inicio.getTime() - b.fecha_inicio.getTime())
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
                onClick={() => setVistaActual("lista")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  vistaActual === "lista"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setVistaActual("calendario")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  vistaActual === "calendario"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Calendario
              </button>
            </div>

            {/* Botón nueva reunión */}
            <button
              onClick={() => {
                setModalClienteVisible(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Nueva Reunión</span>
            </button>
          </div>
        </div>

        {/* Próximas reuniones */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Próximas Reuniones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {proximasReuniones.map((reunion) => (
              <div
                key={reunion.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getTipoIcon(reunion.tipo)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {reunion.titulo}
                      </h4>
                      <p className="text-xs text-gray-500">{reunion.cliente}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {dayjs(reunion.fecha_inicio)
                      .locale("es")
                      .format("dddd D MMMM YYYY")}
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {dayjs(reunion.fecha_inicio)
                        .locale("es")
                        .format("dddd D MMMM YYYY")}{" "}
                      -
                      {dayjs(reunion.fecha_inicio)
                        .locale("es")
                        .format("dddd D MMMM YYYY")}
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
        {vistaActual === "lista" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">
                      Reunión
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">
                      Cliente
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">
                      Fecha y Hora
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">
                      Ubicación
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">
                      Estado
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">
                      Acciones
                    </th>
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
                            <h4 className="font-medium text-gray-900">
                              {reunion.titulo}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {reunion.descripcion}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {handleCliente(reunion.cliente_id).nombre}
                            </p>
                            <p className="text-sm text-gray-500">
                              {handleCliente(reunion.cliente_id).telefono}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {dayjs(reunion.fecha_inicio)
                                .locale("es")
                                .format("dddd D MMMM YYYY")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {dayjs(reunion.fecha_inicio)
                                .locale("es")
                                .format("HH:mm a")}{" "}
                              -
                              {dayjs(reunion.fecha_fin)
                                .locale("es")
                                .format("HH:mm a")}{" "}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {reunion.ubicacion}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getEstadoColor(
                            reunion.estado
                          )}`}
                        >
                          {reunion.estado}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setReunionSeleccionada(reunion);

                              setModalReunion(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Editar
                          </button>
                          {reunion.estado === "cancelada" ? (
                            ""
                          ) : (
                            <button
                              onClick={() => prepararCancelacion(reunion.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Cancelar
                            </button>
                          )}
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
        {vistaActual === "calendario" && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Vista de Calendario
                </h3>
                <p className="text-gray-500">
                  La vista de calendario estará disponible próximamente
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* modal Editar */}
      <Modal
        isOpen={isModalReunion}
        onClose={() => {
          setModalReunion(false);
        }}
      >
        <CrearReunion
          accion={!pendingReunion ? "Editar Reunion" : "Creando..."}
          onSubmit={CambiarReunion}
          initialData={reunionSeleccionada}
        />
      </Modal>

      {/* modal crear reunion */}
      <Modal
        isOpen={modalReunionVisible}
        onClose={() => {
          setModalReunionVisible(false);
        }}
      >
        <CrearReunion
          accion={!pendingCrearReunion ? "Crear Reunion" : "Creando..."}
          onSubmit={CreandoReunion}
        />
      </Modal>

      {/* modal confirmcacion */}
      <ConfirmarAccionToast
        visible={mostrarToast}
        setVisible={setMostrarToast}
        onConfirm={confirmarCancelacion}
        texto="¿Estás seguro de que deseas cancelar esta reunión?"
        posicion="bottom-right"
        tema="dark"
        modoModal={true}
      />

      {/* modal para seleccionar cliente */}
      <Modal
        isOpen={modalClienteVisible}
        onClose={() => setModalClienteVisible(false)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Selecciona un cliente
          </h3>
          <Select
            options={clientes.map((c) => ({
              value: c.id,
              label: c.nombre,
            }))}
            onChange={(opcion) => setClienteSeleccionado(opcion?.value)}
            placeholder="Selecciona un cliente"
            isSearchable
          />
          <button
            disabled={!clienteSeleccionado}
            onClick={() => {
              setModalClienteVisible(false);
              setModalReunionVisible(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Continuar
          </button>
        </div>
      </Modal>
    </Layout>
  );
};
