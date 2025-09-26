import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useAuth } from "../../context/useAuth";
import {
  Actividad,
  Cliente,
  MesEnum,
  Meta,
  Oportunidad,
  Pedido,
  Reunion,
  User,
  Vendedor,
} from "../../types";
import { useSupabase } from "../../hooks/useSupabase";
import { useNavigate } from "react-router-dom";

import {
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import { useVentas } from "../../hooks/useVentas";
import { calculoIncremento } from "../../utils/ventas";
import {
  OportunidadesUtilmes,
  valorPipeline,
  obtenerReunionesProximas,
} from "../../utils/oportunidades";
import { clientesActivos } from "../../utils/clientes";
import { typeChange } from "../../constants/typeCange";
import { formatearActividades } from "../../utils/actividades";
import { useGetMetas } from "../../hooks/useMetas";
import useVendedores from "../../hooks/useVendedores";

dayjs.extend(relativeTime);
dayjs.locale("es");

type DashboardVendedorProps = {
  currentUser?: User;
  pedidos?: Pedido[];
  clientes?: Cliente[];
  actividades?: Actividad[];
  reuniones?: Reunion[];
  oportunidades?: Oportunidad[];
};

export const DashboardVendedor: React.FC<DashboardVendedorProps> = ({
  currentUser,
  pedidos,
  clientes,
  actividades,
  reuniones,
  oportunidades,
}) => {
  const navigate = useNavigate();
  const { userData, currentUser: contextUser } = useAuth();
  const supabase = useSupabase();
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const mesActual: MesEnum = meses[new Date().getMonth()] as MesEnum; // +1 porque getMonth() devuelve 0-11
  const mesAnterior: MesEnum = meses[new Date().getMonth() - 1] as MesEnum;
  //metas
  const { data: metasDataActual } = useGetMetas(
    currentUser?.id || contextUser?.id || ""
  );
  // Si no se pasan props, usa los hooks de supabase
  const { data: clientesData } = supabase.useClientes();
  const { data: pedidosData } = supabase.usePedidos();
  const { data: actividadesData } = supabase.useActividades();
  const { data: reunionesData } = supabase.useReuniones();
  const { data: oportunidadesData } = supabase.useOportunidades();
  const { data: vendedoresData } = useVendedores();

  const [page, setPage] = React.useState(1);
  const pageSize = 5; // o el número de actividades que quieras mostrar por página

  // Si se pasan props, úsalos. Si no, usa los datos de los hooks.
  const _clientes = clientes ?? clientesData ?? [];
  const _pedidos = pedidos ?? pedidosData ?? [];
  const _actividades = actividades ?? actividadesData ?? [];
  const _reuniones = reuniones ?? reunionesData ?? [];
  const _oportunidades = oportunidades ?? oportunidadesData ?? [];
  const _currentUser = currentUser ?? contextUser;

  const pedidosArray = Array.isArray(_pedidos) ? _pedidos : [];
  const { PedidosProcesados, cifraVentasMes } = useVentas(pedidosArray);
  const OportunidadesMes = OportunidadesUtilmes(_oportunidades);

  if (!_currentUser) {
    toast.error("Usuario no logueado");
    navigate("/login");
    return null;
  }

  const metasMesActual =
    Array.isArray(metasDataActual) &&
    metasDataActual?.find((meta: Meta) => meta.mes === mesActual);

  const metasMesAnterior =
    Array.isArray(metasDataActual) &&
    metasDataActual?.find((meta: Meta) => meta.mes === mesAnterior);

  const ventaMes = cifraVentasMes(new Date().getMonth());

  let porcentajeMeta =
    Array.isArray(metasDataActual) &&
    metasMesActual?.objetivo_ventas > 0 &&
    ventaMes > 0
      ? (+ventaMes / +metasMesActual?.objetivo_ventas) * 100
      : 0;
  const porcentajeMetaAnterior =
    Array.isArray(metasDataActual) &&
    metasMesAnterior?.objetivo_ventas > 0 &&
    cifraVentasMes(new Date().getMonth() - 1) > 0
      ? (+cifraVentasMes(new Date().getMonth() - 1) /
          +metasMesAnterior?.objetivo_ventas) *
        100
      : 0;

      if(_currentUser.rol === "admin" && vendedoresData && vendedoresData.length > 0){
        const vendedores = Array.isArray(vendedoresData) ? vendedoresData.filter((v: Vendedor) => v.rol !== "admin") : [];
        porcentajeMeta = porcentajeMeta / vendedores!.length;
      }

  const incremento = calculoIncremento(clientesActivos(_clientes));
  const incrementoVentas = calculoIncremento(PedidosProcesados);
  const incrementoPipeline = calculoIncremento(OportunidadesMes);

  const stats = [
    {
      title: "Clientes Activos",
      value: clientesActivos(_clientes).length ?? "0",
      change: `${incremento.toFixed(2)}%`,
      changeType: `${typeChange(incremento)}` as const,
      icon: Users,
      color: "blue",
    },
    {
      title: "Ventas del Mes",
      value: `$${cifraVentasMes(new Date().getMonth()).toFixed(2)}`,
      change: `${incrementoVentas.toFixed(2)}%`,
      changeType: `${typeChange(incrementoVentas)}` as const,
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Pipeline",
      value: `$${valorPipeline(_oportunidades).toFixed(2)}`,
      change: `${incrementoPipeline.toFixed(2)}%`,
      changeType: `${typeChange(incrementoPipeline)}` as const,
      icon: TrendingUp,
      color: "purple",
    },
    {
      title: "Meta Mensual",
      value: `${porcentajeMeta.toFixed(2)}%`,
      change: `${(porcentajeMeta - porcentajeMetaAnterior).toFixed(2)}%`,
      changeType:
        metasMesActual && ventaMes >= metasMesActual.objetivo_ventas
          ? "positive"
          : "negative",
      icon: Target,
      color: "orange",
    },
  ];

  const actividadesArray = Array.isArray(_actividades) ? _actividades : [];
  const recentActivities = [
    ...formatearActividades(actividadesArray, _clientes, vendedoresData),
  ];
  const reunionesArray = Array.isArray(_reuniones) ? _reuniones : [];
  const upcomingMeetings = [...obtenerReunionesProximas(reunionesArray)];

  // Paginación actividades
  const totalPages = Math.ceil(recentActivities.length / pageSize);
  const paginatedActivities = recentActivities.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Layout
      title={`¡Bienvenido, ${userData?.nombre}!`}
      subtitle="Aquí tienes un resumen de tu actividad de ventas"
    >
      <div className="space-y-6">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      stat.changeType === "positive" ||
                      stat.changeType === "neutral"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change} vs mes anterior
                  </p>
                </div>
                <div
                  className={`p-3 rounded-full ${
                    stat.color === "blue"
                      ? "bg-blue-100"
                      : stat.color === "green"
                      ? "bg-green-100"
                      : stat.color === "purple"
                      ? "bg-purple-100"
                      : "bg-orange-100"
                  }`}
                >
                  <stat.icon
                    className={`h-6 w-6 ${
                      stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "green"
                        ? "text-green-600"
                        : stat.color === "purple"
                        ? "text-purple-600"
                        : "text-orange-600"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actividades recientes */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 min-h-[600px] flex flex-col h-full">
            <div className="flex items-center gap-36">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actividades Recientes
              </h3>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Empresa
              </h3>
            </div>
            <div className="space-y-4 flex-1">
              {paginatedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div
                    className={`p-2 rounded-full ${
                      activity.status === "completada"
                        ? "bg-green-100"
                        : activity.status === "pendiente"
                        ? "bg-yellow-100"
                        : "bg-red-100"
                    }`}
                  >
                    {activity.status === "completada" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : activity.status === "pendiente" ? (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {activity.cliente}
                    </p>
                    {_currentUser?.rol === "admin" && (
                      <p className="text-sm text-gray-500">
                        {activity.vendedor}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {/* Paginación */}
            </div>
            <div className="flex justify-center items-center gap-4 mt-4 ">
              <button
                className={`px-4 py-2 rounded font-semibold transition-colors duration-200
                    ${
                      page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow"
                    }
                  `}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Anterior
              </button>
              <span className="text-gray-700 font-medium">
                Página {page} de {totalPages}
              </span>
              <button
                className={`px-4 py-2 rounded font-semibold transition-colors duration-200
                    ${
                      page === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow"
                    }
                  `}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Siguiente →
              </button>
            </div>
          </div>

          {/* Próximas reuniones */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-36">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Próximas Reuniones
              </h3>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Empresa
              </h3>
            </div>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {meeting.titulo}
                    </p>
                    <p className="text-sm text-gray-500">
                      {/* ...cliente info... */}
                    </p>
                    <p className="text-sm text-blue-600">
                      {dayjs(meeting.fecha_inicio).format("dddd")} a las{" "}
                      {dayjs(new Date(meeting.fecha_inicio).getHours()).format(
                        "HH:mm"
                      )}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p>{Array.isArray(clientesData) ? clientesData.find((c) => c.id === meeting.cliente_id)?.empresa : ""}</p>
                    {_currentUser?.rol === "admin" && (
                      <p>{Array.isArray(vendedoresData) ? vendedoresData.find((v: Vendedor) => v.id === meeting.vendedor_id)?.nombre : ""}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico de rendimiento */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rendimiento de Ventas
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              Gráfico de ventas mensuales (próximamente)
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
