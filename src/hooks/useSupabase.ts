import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/useAuth";
import { User } from "@supabase/supabase-js";
import {
  Cliente,
  ICrearActividad,
  ICrearReunion,
  ICreateOportunidad,
  Pedido,
  Reunion,
  Ticket,
} from "../types";

export const useSupabase = () => {
  const queryClient = useQueryClient();

  // Hook para obtener clientes
  const useClientes = () => {
    const { currentUser } = useAuth();
    return useQuery({
      queryKey: ["clientes", currentUser?.id],
      queryFn: async () => {
        if (!currentUser) return [];
        const { data, error } = await supabase
          .from("clientes")
          .select("*")
          .eq("vendedor_id", currentUser.id)
          .order("fecha_creacion", { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
      },
      enabled: !!currentUser,
    });
  };

  // Hook para obtener actividades
  const useActividades = (clienteId?: string) => {
    const { currentUser } = useAuth();
    return useQuery({
      queryKey: ["actividades", currentUser?.id, clienteId],
      queryFn: async () => {
        if (!currentUser) return [];
        let query = supabase
          .from("actividades")
          .select(`*, clientes (nombre, apellido, empresa)`)
          .eq("vendedor_id", currentUser.id);
        if (clienteId) {
          query = query.eq("cliente_id", clienteId);
        }
        const { data, error } = await query.order("fecha", {
          ascending: false,
        });
        if (error) throw new Error(error.message);
        return data || [];
      },
      enabled: !!currentUser,
    });
  };

  // Hook para obtener reuniones
  const useReuniones = () => {
    const { currentUser } = useAuth();
    return useQuery({
      queryKey: ["reuniones", currentUser?.id],
      queryFn: async () => {
        if (!currentUser) return [];
        const { data, error } = await supabase
          .from("reuniones")
          .select(`*, clientes (nombre, apellido, empresa)`)
          .eq("vendedor_id", currentUser.id)
          .order("fecha_inicio", { ascending: true });
        if (error) throw new Error(error.message);
        return data || [];
      },
      enabled: !!currentUser,
    });
  };

  // Hook para obtener tickets
  const useTickets = () => {
    const { currentUser } = useAuth();
    return useQuery({
      queryKey: ["tickets", currentUser?.id],
      queryFn: async () => {
        if (!currentUser) return [];
        const { data, error } = await supabase
          .from("tickets")
          .select(`*, clientes (nombre, apellido, empresa)`)
          .eq("vendedor_id", currentUser.id)
          .order("fecha_creacion", { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
      },
      enabled: !!currentUser,
    });
  };

  // Hook para obtener pedidos
  const usePedidos = () => {
    const { currentUser } = useAuth();
    return useQuery({
      queryKey: ["pedidos", currentUser?.id],
      queryFn: async () => {
        if (!currentUser) return [];
        const { data, error } = await supabase
          .from("pedidos")
          .select(
            `*, clientes (nombre, apellido, empresa), productos_pedido (*)`
          )
          .eq("vendedor_id", currentUser.id)
          .order("fecha_creacion", { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
      },
      enabled: !!currentUser,
    });
  };

  // Hook para obtener oportunidades (pipeline)
  const useOportunidades = () => {
    const { currentUser } = useAuth();
    return useQuery({
      queryKey: ["oportunidades", currentUser?.id],
      queryFn: async () => {
        if (!currentUser) return [];
        const { data, error } = await supabase
          .from("oportunidades")
          .select(`*, clientes (nombre, apellido, empresa)`)
          .eq("vendedor_id", currentUser.id)
          .order("fecha_creacion", { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
      },
      enabled: !!currentUser,
    });
  };

  // Mutaciones para crear y actualizar registros
  // Custom hooks para mutaciones
  const useCrearCliente = () => {
    return useMutation({
      mutationFn: async ({
        clienteData,
        currentUser,
      }: {
        clienteData: Partial<Cliente>;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const { data, error } = await supabase
          .from("clientes")
          .insert({
            ...clienteData,
            vendedor_id: currentUser.id,
          })
          .select();
        if (error) throw new Error(error.message);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["clientes"] });
      },
    });
  };

  const useCrearActividad = () => {
    return useMutation({
      mutationFn: async ({
        actividadData,
        currentUser,
      }: {
        actividadData: ICrearActividad;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const { data, error } = await supabase
          .from("actividades")
          .insert({
            ...actividadData,
            vendedor_id: currentUser.id,
          })
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["actividades"] });
      },
    });
  };

  const useCrearReunion = () => {
    return useMutation({
      mutationFn: async ({
        reunionData,
        currentUser,
      }: {
        reunionData: ICrearReunion;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const { data, error } = await supabase
          .from("reuniones")
          .insert({
            ...reunionData,
            vendedor_id: currentUser.id,
          })
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["reuniones"] });
      },
    });
  };

  const useCrearTicket = () => {
    return useMutation({
      mutationFn: async ({
        ticketData,
        currentUser,
      }: {
        ticketData: Ticket;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const { data, error } = await supabase
          .from("tickets")
          .insert({
            ...ticketData,
            vendedor_id: currentUser.id,
          })
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      },
    });
  };

  const useCrearPedido = () => {
    return useMutation({
      mutationFn: async ({
        pedidoData,
        currentUser,
      }: {
        pedidoData: Pedido;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const { data, error } = await supabase
          .from("pedidos")
          .insert({
            ...pedidoData,
            vendedor_id: currentUser.id,
          })
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      },
    });
  };

  const useCrearOportunidades = () => {
    return useMutation({
      mutationFn: async ({
        oportunidadData,
        currentUser,
      }: {
        oportunidadData: ICreateOportunidad;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const { data, error } = await supabase
          .from("oportunidades")
          .insert({
            ...oportunidadData,
          })
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["oportunidades"] });
      },
    });
  };

  const useActualizarCliente = () => {
    return useMutation({
      mutationFn: async ({
        clienteData,
        currentUser,
      }: {
        clienteData: Cliente;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const { data, error } = await supabase
          .from("clientes")
          .update(clienteData)
          .eq("id", clienteData.id)
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["clientes"] });
      },
    });
  };

  const useActualizarReunion = () => {
    return useMutation({
      mutationFn: async ({
        ReunionData,
        currentUser,
      }: {
        ReunionData: Partial<Reunion>;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const { data, error } = await supabase
          .from("reuniones")
          .update(ReunionData)
          .eq("id", ReunionData.id)
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["reuniones"] });
      },
    });
  };

  return {
    useClientes,
    useActividades,
    useReuniones,
    useTickets,
    usePedidos,
    useOportunidades,
    useCrearCliente,
    useCrearActividad,
    useCrearReunion,
    useCrearTicket,
    useCrearPedido,
    useCrearOportunidades,
    useActualizarCliente,
    useActualizarReunion,
  };
};
