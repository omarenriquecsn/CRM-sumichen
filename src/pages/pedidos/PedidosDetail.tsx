import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSupabase } from "../../hooks/useSupabase";
import { useAuth } from "../../context/useAuth";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  FileText,
  Package,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Truck,
  Edit,
  CreditCard,
  DollarSign,
  Building,
} from "lucide-react";
import { Layout } from "../../components/layout/Layout";
import { ConfirmarAccionToast } from "../../components/ui/ConfirmarAccionToast";
import dayjs from "dayjs";
import { Pedido, ProductoPedido } from "../../types";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

const PedidosDetail = () => {
  const { id } = useParams();
  const supabase = useSupabase();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [accionConfirmar, setAccionConfirmar] = useState<{
    accion: string;
    nuevoEstado: Pedido["estado"];
  } | null>(null);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] =
    useState(false);

  // Pedidos
  const {
    data: pedidos,
    isLoading: loadingPedidos,
    error: errorPedidos,
  } = supabase.usePedidos();

  // Actualizar Pedido
  const { mutate: actualizarPedido, isPending: isUpdatingPedido } =
    supabase.useActualizarPedido();

  const prepararActualizarEstado = (
    accion: string,
    nuevoEstado: Pedido["estado"]
  ) => {
    setAccionConfirmar({ accion, nuevoEstado });
  };

  const handleActualizarEstado = () => {
    if (!currentUser) {
      toast.error("Debes iniciar sesión para realizar esta acción.");
      return;
    }
    const pedido = pedidos?.find((p) => p.id === id);
    if (!pedido || !accionConfirmar) {
      toast.error("No se pudo encontrar el pedido para actualizar.");
      return;
    }

    actualizarPedido(
      {
        PedidoData: {
          id: pedido.id,
          estado: accionConfirmar.nuevoEstado,
        },
        currentUser,
      },
      {
        onSuccess: () => {
          toast.success(`¡Pedido marcado como ${accionConfirmar.nuevoEstado}!`);
          setAccionConfirmar(null);
        },
        onError: (error: Error) => {
          toast.error(`Error al actualizar el pedido: ${error.message}`);
          setAccionConfirmar(null);
        },
      }
    );
  };
  useMemo(() => {
    const pedidosMap = pedidos?.find((p) => p.id === id);
    if (!pedidosMap) {
      toast.error("No se encontró el pedido.");
      navigate("/pedidos");
    }
  }, [pedidos, id, navigate]);

  if (errorPedidos) {
    toast.error("Error al cargar los datos del pedido.");
    navigate("/pedidos");
    return;
  }

  if (loadingPedidos) {
    return <LoadingSpinner />;
  }

  if (!pedidos) {
    toast.error("No se encontraron pedidos.");
    navigate("/pedidos");
    return;
  }

  const pedido = pedidos.find((p) => p.id === id);

  if (!pedido) {
    toast.error("Pedido no encontrado.");
    navigate("/pedidos");
    return;
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "borrador":
        return "bg-gray-100 text-gray-800";
      case "enviado":
        return "bg-blue-100 text-blue-800";
      case "aprobado":
        return "bg-green-100 text-green-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      case "procesando":
        return "bg-yellow-100 text-yellow-800";
      case "completado":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoIcon = (estado: string) => {
    const iconProps = { className: "h-8 w-8" };
    switch (estado) {
      case "borrador":
        return <FileText {...iconProps} />;
      case "enviado":
        return <Package {...iconProps} />;
      case "aprobado":
        return <CheckCircle {...iconProps} />;
      case "rechazado":
        return <XCircle {...iconProps} />;
      case "procesando":
        return <Clock {...iconProps} />;
      case "completado":
        return <CheckCircle {...iconProps} />;
      default:
        return <ShoppingCart {...iconProps} />;
    }
  };

  return (
    <Layout
      title="Detalle del Pedido"
      subtitle="Información completa y gestión del pedido"
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/pedidos" className="flex items-center space-x-2" />
        </div>
      </div>
      <ConfirmarAccionToast
        visible={mostrarModalConfirmacion}
        setVisible={setMostrarModalConfirmacion}
        onConfirm={handleActualizarEstado}
        texto={`¿Estás seguro de que deseas ${accionConfirmar?.accion} este pedido?`}
        posicion="bottom-right"
        tema="dark"
        modoModal={true}
      />
      <div className="flex items-center space-x-4">
        <Link
          to="/pedidos"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver a Pedidos</span>
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
                    pedido.estado
                  )}`}
                >
                  {getEstadoIcon(pedido.estado)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Pedido #{pedido.numero}
                  </h2>
                  <p className="text-gray-600">
                    Creado el{" "}
                    {dayjs(pedido.fechaCreacion).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getEstadoColor(
                  pedido.estado
                )}`}
              >
                {pedido.estado}
              </span>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Productos</h4>
              <div className="space-y-3">
                {pedido.productos_pedido.map((producto: ProductoPedido) => (
                  <div
                    key={producto.id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {producto.nombre}
                      </p>{" "}
                      <p className="text-sm text-gray-600">
                        Cantidad: {producto.cantidad} x ${producto.precio}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${producto.subtotal.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-center border-t border-gray-200 pt-4 mt-4">
                <p className="text-lg font-semibold text-gray-900">
                  Total: ${pedido.total.toLocaleString()}
                </p>
              </div>
            </div>


           
    
          </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Notas del Pedido</span>
                </h4>
                <p className="text-blue-700 whitespace-pre-wrap">
                  {pedido.notas ? pedido.notas : "No hay notas para mostrar."}
                </p>
              </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detalles Adicionales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <CreditCard className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-500">Forma de Pago</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {pedido.tipo_pago === "credito"
                      ? `Crédito (${pedido.dias_credito || "N/A"} días)`
                      : pedido.tipo_pago || "No especificado"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <Truck className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-500">Transporte</p>
                  <p className="font-medium text-gray-900">
                    {pedido.transporte || "No especificado"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <DollarSign className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-500">Moneda</p>
                  <p className="font-medium text-gray-900">
                    {pedido.moneda || "No especificada"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información del Cliente
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Nombre</p>
                  <p className="font-medium text-gray-900">
                    {pedido.clientes.nombre} {pedido.clientes.apellido}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />{" "}
                <div>
                  <p className="text-gray-500">Fecha de Entrega</p>
                  <p className="font-medium text-gray-900">
                    {dayjs(pedido.fechaEntrega).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Última Actualización</p>
                  <p className="font-medium text-gray-900">
                    {dayjs(pedido.fechaActualizacion).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Empresa</p>
                  <p className="font-medium text-gray-900">
                    {pedido.clientes.empresa}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones del Pedido
            </h3>
            <div className="space-y-3">
              {currentUser?.user_metadata.rol === "admin" && (
                <button
                  onClick={() => navigate(`/pedidos/editar/${pedido.id}`)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Editar Pedido</span>
                </button>
              )}

              {pedido.estado === "enviado" &&
                currentUser?.user_metadata.rol === "admin" && (
                  <>
                    <button
                      onClick={() =>
                        prepararActualizarEstado("aprobar", "aprobado")
                      }
                      disabled={isUpdatingPedido}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Aprobar Pedido</span>
                    </button>{" "}
                    <button
                      onClick={() =>
                        prepararActualizarEstado("rechazar", "rechazado")
                      }
                      disabled={isUpdatingPedido}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Rechazar Pedido</span>
                    </button>
                  </>
                )}

              {pedido.estado === "aprobado" &&
                currentUser?.user_metadata.rol === "admin" && (
                  <button
                    onClick={() =>
                      prepararActualizarEstado("procesar", "procesando")
                    }
                    disabled={isUpdatingPedido}
                    className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Marcar como Procesando</span>
                  </button>
                )}

              {pedido.estado === "procesando" &&
                currentUser?.user_metadata.rol === "admin" && (
                  <button
                    onClick={() =>
                      prepararActualizarEstado("completar", "completado")
                    }
                    disabled={isUpdatingPedido}
                    className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    <Truck className="h-4 w-4" />
                    <span>Marcar como Completado</span>
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PedidosDetail;
