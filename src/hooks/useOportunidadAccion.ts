import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { Oportunidad } from "../types";
import { useSupabase } from "./useSupabase";


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

  //   Handle Drag and Drop para dnd-kit
  const actualizarEtapaDrag = (
    oportunidadId: string,
    nuevaEtapa: "inicial" | "calificado" | "propuesta" | "negociacion" | "cerrado"
  ) => {
    if (!currentUser) return;

    // Buscar la oportunidad actual en cache (opcional, si necesitas más datos)
    // Aquí asumimos que solo necesitas id y etapa
    editarOportunidad({
      OportunidadData: {
        id: oportunidadId,
        etapa: nuevaEtapa,
      },
      currentUser,
    });
    toast.success("Oportunidad actualizada exitosamente");
  };

  return {
    submitOportunidad,
    actualizarEtapaDrag,
  };
};
