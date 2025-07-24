import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { Oportunidad } from "../types";
import { useSupabase } from "./useSupabase";
import { DropResult } from "@hello-pangea/dnd";

export const useOportunidadAccion = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const supabase = useSupabase();

  const { mutate: CrearOportunidad } = supabase.useCrearOportunidades();
  const { mutate: editarOportunidad } = supabase.useActualizarOportunidad();

  //   Functions
  const submitOportunidad = (
    data: Partial<Oportunidad>,
    onClose: () => void
  ) => {
    if (!currentUser) {
      toast.error("Error usuario no logueado");
      navigate("/login");
      return;
    }

    CrearOportunidad({
      oportunidadData: data,
      currentUser,
    });

    toast.success("Oportunidad creada exitosamente");
    onClose();
  };

  //   Handle Drag and Drop
  const actualizarEtapaDrag = (
    result: DropResult,
    oportunidades?: Oportunidad[]
  ) => {
    if (!currentUser) return;

    const { source, destination, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) return;

    const oportunidad = oportunidades?.find((o) => o.id === draggableId);

    if (!oportunidad) return;
    const actualizada = {
      ...oportunidad,
      etapa: destination.droppableId as
        | "inicial"
        | "calificado"
        | "propuesta"
        | "negociacion"
        | "cerrado",
    };

    editarOportunidad({ OportunidadData: actualizada, currentUser });
    toast.success("Oportunidad actualizada exitosamente");
  };

  return {
    submitOportunidad,
    actualizarEtapaDrag,
  };
};
