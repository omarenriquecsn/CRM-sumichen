import dayjs from "dayjs";
import {
  Actividad,
  ActividadFormateada,
  User,
} from "../types";
import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";

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
  const tipoFormateado =
    tipo === "reunion"
      ? "Reuniones"
      : tipo.charAt(0).toUpperCase() + tipo.slice(1) + "s";
  if (!actividades)
    return {
      tipo: tipoFormateado,
      cantidad: 0,
      porcentaje: 0,
    };
  const actividadesFiltradas = (
    Array.isArray(actividades) ? actividades : []
  ).filter((actividad) => actividad.tipo === tipo);

  return {
    tipo: tipoFormateado,
    cantidad: actividadesFiltradas?.length,
    porcentaje: 10,
  };
};

export interface CrearActividadParams {
  data: Partial<Actividad>;
  currentUser: Partial<User> | User;
  navigate: NavigateFunction;
  crearActividad: (
    params: {
      actividadData: Partial<Actividad>;
      currentUser: Partial<User> | User;
    },
    callbacks: {
      onSuccess: () => void;
      onError: (error: unknown) => void;
    }
  ) => void;
  setModalBOpen: (v: boolean) => void;
}

export function handleCrearActividadUtil({
  data,
  currentUser,
  navigate,
  crearActividad,
  setModalBOpen,
}: CrearActividadParams) {
  if (!currentUser) {
    toast.error("Error el usuario no logueado");
    navigate("/login");
    return;
  }
  crearActividad(
    { actividadData: data, currentUser },
    {
      onSuccess: () => {
        toast.success("Actividad creada");
        setModalBOpen(false);
      },
      onError: (error: unknown) => {
        toast.error("Error al Crear Actividad");
        if (error instanceof Error) {
          throw new Error(`Error: ${error.message}`);
        } else {
          throw new Error("Error desconocido");
        }
      },
    }
  );
}
