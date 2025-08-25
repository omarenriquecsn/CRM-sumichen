import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Define or import the MetasFormState type
// Replace this definition with the correct structure if it exists elsewhere
export type MetasFormState = {
  // Example fields, replace with actual fields as needed
  meta1: number;
  meta2: number;
  // Add other fields here
};

const URL = import.meta.env.VITE_BACKEND_URL;

// Obtener metas de un vendedor (por mes o todos)
export function useGetMetas(vendedorId: string, mes?: string) {
  return useQuery({
    queryKey: ["metas", vendedorId, mes],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (mes) params.append("mes", mes);
      const res = await fetch(`${URL}/metas/${vendedorId}?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al obtener metas");
      return res.json();
    },
    enabled: !!vendedorId,
  });
}

// Crear o actualizar metas de un vendedor
export function usePostMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      vendedorId,
      metas,
    }: { vendedorId: string; metas: MetasFormState }) => {
      const res = await fetch(`${URL}/metas/${vendedorId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(metas),
      });
      if (!res.ok) throw new Error("Error al guardar metas");
      return res.json();
    },
    onSuccess: (_, { vendedorId }) => {
      queryClient.invalidateQueries({ queryKey: ["metas", vendedorId] });
    },
  });
}