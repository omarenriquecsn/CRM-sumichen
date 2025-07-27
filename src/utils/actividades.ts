import dayjs from "dayjs";
import { Actividad, ActividadFormateada } from "../types";

export function formatearActividades(
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
      type: actividad.tipo.toLowerCase(),
      title: actividad.titulo,
      time: dayjs(fechaLimite).fromNow(),
      status,
    };
  });
}

export const actividadesPoCategoria = (
  actividades: Actividad[] | undefined,
  tipo: string
) => {
  const tipoFormateado = tipo === 'reunion' ? 'Reuniones' : tipo.charAt(0).toUpperCase() + tipo.slice(1) + "s";
  if (!actividades)
    return {
      tipo: tipoFormateado,
      cantidad: 0,
      porcentaje: 0,
    };
  const actividadesFiltradas = (Array.isArray(actividades) ? actividades : []).filter(
    (actividad) => actividad.tipo === tipo
  );

  return {
    tipo: tipoFormateado,
    cantidad: actividadesFiltradas?.length,
    porcentaje: 10,
  };
};


