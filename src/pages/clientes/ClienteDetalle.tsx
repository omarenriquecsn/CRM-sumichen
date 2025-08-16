import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Plus,
  MessageSquare,
  FileText,
  Clock,
  IdCard,
  User2,
  Check,
  Trash,
} from "lucide-react";
import {
  Actividad,
  Cliente,
  ClienteFormData,
  IFormReunion,
  Pedido,
  PedidoData,
} from "../../types";
import Modal from "../../components/ui/Modal";
import ClienteForm from "../../components/forms/ClienteFom";
import { useAuth } from "../../context/useAuth";
import { useSupabase } from "../../hooks/useSupabase";
import { toast } from "react-toastify";
import CrearActividad from "../../components/forms/CrearActividad";
import { isMobile } from "react-device-detect";
import CrearReunion from "../../components/forms/CrearReunion";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { handleCrearPedidoUtil, utilsPedidos } from "../../utils/pedidos";
import CrearPedido from "../../components/forms/CrearPedido";
import { getEstadoColor, getEtapaColor } from "../../utils/clientes";
import { handleCrearActividadUtil } from "../../utils/actividades";
import { handleCrearReunionUtil } from "../../utils/reuniones";

export const ClienteDetalle: React.FC = () => {
  dayjs.locale("es");

  const { currentUser } = useAuth();
  const supabase = useSupabase();
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalBOpen, setModalBOpen] = useState(false);
  const [isModalCOpen, setModalCopen] = useState(false);
  const [modalPedidoVisible, setModalPedidoVisible] = useState(false);

  // Actividades
  const { data: actividadesTodas, error: errorActividades } =
    supabase.useActividades();

    const { mutate: crearActividad, isPending: pendingActividad } =
      supabase.useCrearActividad();
  
    const {mutate: actualizarActividad} = supabase.useActualizarActividad();

    const {mutate: eliminarActividad} = supabase.useEliminarActividad();
  // Clientes
  const { data: clientes } = supabase.useClientes();
  const { mutate: editarCliente, isPending: pendigEditar } =
    supabase.useActualizarCliente();

  // Pedidos
  const { data: pedidos } = supabase.usePedidos();
  const { mutate: nuevoPedido, isPending: isPendingPedido } =
    supabase.useCrearPedido();

  // Reuniones
  const { mutate: crearReunion, isPending: pendingReunion } =
    supabase.useCrearReunion();

  // Oportunidades
  const { mutate: editarOportunidad } = supabase.useActualizarOportunidad();
  const {data: oportunidades} = supabase.useOportunidades();

  if (!currentUser) {
    toast.error("Debes iniciar sesión para ver los pedidos");
    navigate("/login");
    return;
  }
  const handleEditCliente = () => {
    setModalOpen(true);
  };

  if (clientes) {
    // Cliente filtrado

    const cliente = (Array.isArray(clientes) ? clientes : []).find(
      (c) => c.id === id
    );
    const actividades = (
      Array.isArray(actividadesTodas) ? actividadesTodas : []
    ).filter((a) => a.cliente_id === id);

    if (!cliente) {
      toast.error("Cliente no encontrado");
      navigate("/clientes");
      return;
    }

    // Pedidos filtrados Ultima Compra Abrir Gmail

    const { pedidosFiltrados, ultimaCompra, abrirGmail } = utilsPedidos(
      pedidos as Pedido[],
      cliente
    );

    // Completando actividad
    const completarActividad = (actividad: Actividad) => {
      if (!currentUser) return;

      

      actualizarActividad({
        ...actividad,
        completado: true,
      });
      toast.success("Actividad completada");
    };

    // Eliminar actividad
    const eliminarActividadFn = (actividad: Actividad) => {
      if (!currentUser) return;

      eliminarActividad(actividad);
      toast.success("Actividad eliminada");
    };

    // Handlers
    // Handle Update Cliente
    const handleUpdateCliente = async (data: ClienteFormData) => {
      if (!currentUser) return;

      if (!cliente) {
        throw new Error("Cliente no encontrado");
      }
      const clienteData: Cliente = {
        ...cliente,
        ...data,
        estado: data.estado as Cliente["estado"],
        etapa_venta: data.etapa_venta as Cliente["etapa_venta"],
      };

     const oportunidad = Array.isArray(oportunidades) && oportunidades?.find(
        (o) => o.cliente_id === cliente.id
      );

      if (oportunidad) {
        await editarOportunidad({
          OportunidadData: {
            ...oportunidad,
            etapa: clienteData.etapa_venta as "inicial" | "calificado" | "propuesta" | "negociacion" | "cerrado",
          },
          currentUser,
        });
      }



      editarCliente(
        {
          clienteData,
          currentUser,
        },
        {
          onSuccess: () => {
            toast.success("Usuario Editado");
            setModalOpen(false);
          },
          onError: (error: unknown) => {
            if (error instanceof Error) {
              toast.error("Error al editar cliente");
            }
          },
        }
      );
    };

    // Handle Crear Actividad
    const handleCrearActividad = async (data: Partial<Actividad>) => {
      handleCrearActividadUtil({
        data,
        currentUser,
        navigate,
        crearActividad,
        setModalBOpen,
      });
    };

    // Handle Crear Reunion
    const handleCrearReunion = (data: IFormReunion) => {
      handleCrearReunionUtil({
        data,
        currentUser,
        navigate,
        crearReunion,
        setModalCopen,
      });
    };

    // Handle Crear Pedido

    const handleCrearPedido = (data: PedidoData) => {
      handleCrearPedidoUtil({
        data,
        currentUser,
        clienteSeleccionado: cliente.id,
        nuevoPedido,
        setModalPedidoVisible,
      });
    };

    // Función para obtener el icono según el tipo de actividad
    const getTipoIcon = (tipo: string) => {
      switch (tipo) {
        case "reunion":
          return <Calendar className="h-4 w-4" />;
        case "llamada":
          return <Phone className="h-4 w-4" />;
        case "email":
          return <Mail className="h-4 w-4" />;
        case "tarea":
          return <FileText className="h-4 w-4" />;
        default:
          return <MessageSquare className="h-4 w-4" />;
      }
    };

    return (
      <Layout
        title={`${cliente?.nombre} ${cliente?.apellido}`}
        subtitle={`${cliente?.empresa}`}
      >
        <div className="space-y-6">
          {/* Navegación */}
          <div className="flex items-center space-x-4">
            <Link
              to="/clientes"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver a Clientes</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Datos del cliente */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">
                        {cliente.empresa ? cliente.empresa[0].toUpperCase() : "E"}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {cliente?.empresa}
                      </h2>

                      <div className="flex items-center space-x-3 mt-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getEstadoColor(
                            cliente?.estado ? cliente.estado : "inactivo"
                          )}`}
                        >
                          {cliente?.estado}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getEtapaColor(
                            cliente?.etapa_venta
                              ? cliente.etapa_venta
                              : "inicial"
                          )}`}
                        >
                          {cliente?.etapa_venta}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditCliente()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Editar</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">
                          {cliente?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p className="font-medium text-gray-900">
                          {cliente?.telefono}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Contacto</p>
                        <p className="font-medium text-gray-900">
                          {cliente?.nombre} {cliente?.apellido}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Dirección</p>
                        <p className="font-medium text-gray-900">
                          {cliente?.direccion}
                        </p>
                        <p className="text-sm text-gray-500">
                          {cliente?.ciudad}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <IdCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Rif de Empresa</p>
                        <p className="font-medium text-gray-900">
                          {cliente?.rif}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Cliente desde</p>
                        <p className="font-medium text-gray-900">
                          {cliente?.fecha_creacion
                            .toLocaleString()
                            .slice(0, 10)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {cliente?.notas && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Notas</h4>
                    <p className="text-gray-600">{cliente.notas}</p>
                  </div>
                )}
              </div>

              {/* Actividades */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Actividades
                  </h3>
                  <button
                    onClick={() => setModalBOpen(true)}
                    className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 ${
                      isMobile ? "mobile-button" : ""
                    }`}
                  >
                    <Plus
                      className={`h-4 w-4 ${isMobile ? "mobile-plus" : ""}`}
                    />
                    {!isMobile && <span>Nueva Actividad</span>}
                  </button>
                </div>

                <div className="space-y-4">
                  <>
                    {errorActividades ? (
                      <p>Error al cargar las actividades</p>
                    ) : actividades && actividades.length > 0 ? (
                      actividades.map((actividad) => (
                        <div
                          key={actividad.id}
                          className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg"
                        >
                          <div
                            className={`p-2 rounded-full ${
                              actividad.completado
                                ? "bg-green-100"
                                : "bg-blue-100"
                            }`}
                          >
                            <div
                              className={`${
                                actividad.completado
                                  ? "text-green-600"
                                  : "text-blue-600"
                              }`}
                            >
                              {getTipoIcon(actividad.tipo)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">
                                {actividad.titulo}
                              </h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {actividad.fecha
                                    .toLocaleString()
                                    .slice(0, 10)}
                                </span>
                                {!actividad.completado &&
                                  <button onClick={() => completarActividad(actividad)}>
                                  <Check className="h-5 w-5  text-green-600 hover:text-green-900" />
                                </button>
                                }
                                <div>
                                  <button onClick={() => eliminarActividadFn(actividad)}>
                                    <Trash className="h-5 w-5 text-red-600 hover:text-red-900" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 mt-1">
                              {actividad.descripcion}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                  actividad.completado
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {actividad.completado
                                  ? "Completado"
                                  : "Pendiente"}
                              </span>
                              <span className="text-xs text-gray-500 capitalize">
                                {actividad.tipo}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No hay actividades disponibles</p>
                    )}
                  </>
                </div>
              </div>
            </div>

            {/* Panel lateral */}
            <div className="space-y-6">
              {/* Acciones rápidas */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Acciones Rápidas
                </h3>
                <div className="space-y-3">
                  {isMobile && cliente.telefono && (
                    <a href={`tel:${cliente.telefono}`}>
                      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>Llamar</span>
                      </button>
                    </a>
                  )}
                  {isMobile ? (
                    <a
                      href={`mailto:${cliente.email}?subject=Contacto desde CRM&body=Hola ${cliente.nombre},`}
                    >
                      <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Enviar Email</span>
                      </button>
                    </a>
                  ) : (
                    <button
                      onClick={() => abrirGmail({
                        cliente,
                        currentUser,
                        navigate,
                        crearActividad
                      })}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Enviar Email</span>
                    </button>
                  )}
                  <button
                    onClick={() => setModalCopen(true)}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Agendar Reunión</span>
                  </button>
                  <button
                    onClick={() => setModalPedidoVisible(true)}
                    className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Crear Pedido</span>
                  </button>
                </div>
              </div>

              {/* Resumen de ventas */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumen de Ventas
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Valor Total</p>
                    <p className="text-2xl font-bold text-green-600">
                      $
                      {pedidosFiltrados()
                        ? Number(
                            pedidosFiltrados()?.reduce(
                              (total, pedido) => total + Number(pedido.total),
                              0
                            )
                          ).toLocaleString()
                        : "0"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pedidos Realizados</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {pedidosFiltrados()?.length ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Última Compra</p>
                    <p className="text-sm text-gray-900">
                      {ultimaCompra?.fecha_creacion
                        ? dayjs(ultimaCompra.fecha_creacion).format(
                            "D [de] MMMM [de] YYYY"
                          )
                        : "No ha comprado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
          title={"Editar Cliente"}
        >
          <ClienteForm
            onSubmit={handleUpdateCliente}
            initialData={cliente || undefined}
            accion={!pendigEditar ? "Editar Cliente" : "Editando"}
          />
        </Modal>
        <Modal
          isOpen={isModalBOpen}
          onClose={() => {
            setModalBOpen(false);
          }}
          title={"Crear Activida"}
        >
          <CrearActividad
            accion={!pendingActividad ? "Crear Actividad" : "Creando..."}
            id={id}
            onSubmit={handleCrearActividad}
          />
        </Modal>
        <Modal
          isOpen={isModalCOpen}
          onClose={() => {
            setModalCopen(false);
          }}
          title={"Crear Reunion"}
        >
          <CrearReunion
            accion={!pendingReunion ? "Crear Reunion" : "Creando..."}
            cliente_id={id}
            onSubmit={handleCrearReunion}
          />
        </Modal>
        <Modal
          isOpen={modalPedidoVisible}
          onClose={() => {
            setModalPedidoVisible(false);
          }}
          title={"Crear Pedido"}
        >
          <CrearPedido
            accion={!isPendingPedido ? "Crear Pedido" : "Creando..."}
            onSubmit={handleCrearPedido}
          />
        </Modal>
      </Layout>
    );
  }
};
