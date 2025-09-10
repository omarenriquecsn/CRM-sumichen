import { createClient } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Configura tu cliente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Update_at = {
  id: number;
  update_at: string;
};

export function useInsertSupabase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const data: Update_at = {
        id: 1,
        update_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("actualizacion_inventario")
        .upsert([data], { onConflict: "id" });
      if (error) {
        throw new Error(error.message);
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actualizacion_inventario"] });
    },
  });
}
export function useGetActualizacionInventario() {
  return useQuery({
    queryKey: ["actualizacion_inventario"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("actualizacion_inventario")
        .select("*")
        .eq("id", 1) // Si solo quieres el registro con id=1
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
