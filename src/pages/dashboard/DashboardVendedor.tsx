import React from "react";
import { Layout } from "../../components/layout/Layout";
import { useAuth } from "../../context/useAuth";
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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSupabase } from "../../hooks/useSupabase";
import {
  Actividad,
  ActividadFormateada,
  Cliente,
  Pedido,
  Reunion,
} from "../../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";

dayjs.extend(relativeTime);

dayjs.locale("es");

export const DashboardVendedor: React.FC = () => {
  const supabase = useSupabase();
  const navigate = useNavigate();
  const { userData, currentUser } = useAuth();

  const { data: clientes } = supabase.useClientes();
  const { data: pedidos } = supabase.usePedidos();
  const { data: actividades } = supabase.useActividades();
  const { data: reuniones } = supabase.useReuniones();
  // const {data: metas} = supabase.useMetas();

  if (!currentUser) {
    toast.error("Usuario no logueado");
    navigate("/login");
    return;
  }

  const clientesActivos =
    clientes?.filter((cliente) => cliente.estado === "activo") ?? [];

  const PedidosProcesados =
    pedidos?.filter((pedido) => pedido.estado === "procesado") ?? [];

  const VentasdelMes = PedidosProcesados.filter(
    (pedido) =>
      new Date(pedido.fecha_creacion).getMonth() === new Date().getMonth()
  );

  const cifraVentasMes = () => {
    return `$${VentasdelMes.reduce(
      (total, pedido) => total + Number(pedido.total),
      0
    )}`;
  };

  function obtenerReunionesProximas(reuniones: Reunion[]): Reunion[] {
    if (!reuniones) return [];
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + 2);

    return reuniones
      .map((r) => ({
        ...r,
        fecha: new Date(r.fecha_inicio),
      }))
      .filter((r) => r.fecha >= hoy && r.fecha <= limite)
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
      .slice(0, 4);
  }

  const calculoIncremento = (valorFinal: Cliente[] | Pedido[]) => {
    const valorInicial = valorFinal.filter(
      (valor) =>
        new Date(valor.fecha_creacion).getMonth() !== new Date().getMonth()
    );

    let incremento: number;

    if (valorInicial.length === 0) {
      incremento = valorFinal.length > 0 ? 100 : 0;
    } else {
      incremento =
        ((valorFinal.length - valorInicial.length) / valorInicial.length) * 100;
    }
    return incremento;
  };

  const cliente = (cliente_id: string) => {
    const cliente = clientes?.find((c) => c.id === cliente_id);
    return cliente;
  };

  const incremento = calculoIncremento(clientesActivos);
  const incrementoVentas = calculoIncremento(PedidosProcesados);

  const typeChange = (incremento: number) => {
    if (incremento > 0) {
      return "positive";
    } else if (incremento < 0) {
      return "negative";
    } else {
      return "neutral";
    }
  };

  const stats = [
    {
      title: "Clientes Activos",
      value: clientesActivos?.length.toString() ?? "0",
      change: `${incremento}%`,
      changeType: `${typeChange(incremento)}` as const,
      icon: Users,
      color: "blue",
    },
    {
      title: "Ventas del Mes",
      value: `${cifraVentasMes()}`,
      change: `${incrementoVentas}%`,
      changeType: "positive" as const,
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Pipeline",
      value: "$128,500",
      change: "+12%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "purple",
    },
    {
      title: "Meta Mensual",
      value: "78%",
      change: "+5%",
      changeType: "positive" as const,
      icon: Target,
      color: "orange",
    },
  ];

 

  dayjs.extend(relativeTime);
  dayjs.locale("es");

  function formatearActividades(
    actividades: Actividad[]
  ): ActividadFormateada[] {
    const ahora = new Date();

    return actividades.map((actividad) => {
      const fechaLimite = actividad.fecha_vencimiento ?? actividad.fecha;
      const vencida = !actividad.completado && fechaLimite < ahora;

      let status: ActividadFormateada["status"] = "pendiente";
      if (actividad.completado) status = "completada";
      else if (vencida) status = "vencida";

      return {
        id: actividad.id,
        type: actividad.tipo.toLowerCase(), // Ej. 'llamada', 'tarea', 'reunion'
        title: actividad.titulo,
        time: dayjs(fechaLimite).fromNow(), // Ej. "hace 2 días"
        status,
      };
    });
  }
  const recentActivities = [
    ...formatearActividades(actividades ?? []),
  ];

  const upcomingMeetings = [...obtenerReunionesProximas(reuniones ?? [])];

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
                      stat.changeType === "positive"
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
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actividades Recientes
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
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
                </div>
              ))}
            </div>
          </div>

          {/* Próximas reuniones */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Próximas Reuniones
            </h3>
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
                      {cliente(meeting.cliente_id)?.nombre}{" "}
                      {cliente(meeting.cliente_id)?.apellido} -{" "}
                      {cliente(meeting.cliente_id)?.empresa}
                    </p>
                    <p className="text-sm text-blue-600">
                      {dayjs(meeting.fecha_inicio).format("dddd")} a las{" "}
                      {dayjs(new Date(meeting.fecha_inicio).getHours()).format(
                        "HH:mm"
                      )}
                    </p>
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
