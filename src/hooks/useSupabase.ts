import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/useAuth";
import { User } from "@supabase/supabase-js";
import {
  Actividad,
  Cliente,
  Oportunidad,
  Pedido,
  Reunion,
  Ticket,
} from "../types";

export const useSupabase = () => {
  // const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook para obtener clientes
  const useClientes = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);

    const { currentUser } = useAuth();

    useEffect(() => {
      if (!currentUser) return;

      const fetchClientes = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("clientes")
            .select("*")
            .eq("vendedor_id", currentUser.id)
            .order("fecha_creacion", { ascending: false });

          if (error) throw error;
          setClientes(data || []);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error desconocido");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchClientes();
    }, [currentUser]);

    return { clientes, loading, error };
  };

  // Hook para obtener actividades
  const useActividades = (clienteId?: string) => {
    const [actividades, setActividades] = useState<Actividad[]>([]);

    const { currentUser } = useAuth();

    useEffect(() => {
      if (!currentUser) return;

      const fetchActividades = async () => {
        setLoading(true);
        try {
          let query = supabase
            .from("actividades")
            .select(
              `
              *,
              clientes (nombre, apellido, empresa)
            `
            )
            .eq("vendedor_id", currentUser.id);

          if (clienteId) {
            query = query.eq("cliente_id", clienteId);
          }

          const { data, error } = await query.order("fecha", {
            ascending: false,
          });

          if (error) throw error;
          setActividades(data || []);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error desconocido");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchActividades();
    }, [currentUser, clienteId]);

    return { actividades, loading, error };
  };

  // Hook para obtener reuniones
  const useReuniones = () => {
    const { currentUser } = useAuth();
    const [reuniones, setReuniones] = useState<Reunion[]>([]);

    useEffect(() => {
      if (!currentUser) return;

      const fetchReuniones = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("reuniones")
            .select(
              `
              *,
              clientes (nombre, apellido, empresa)
            `
            )
            .eq("vendedor_id", currentUser.id)
            .order("fecha_inicio", { ascending: true });

          if (error) throw error;
          setReuniones(data || []);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error desconocido");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchReuniones();
    }, [currentUser]);

    return { reuniones, loading, error };
  };

  // Hook para obtener tickets
  const useTickets = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const { currentUser } = useAuth();

    useEffect(() => {
      if (!currentUser) return;

      const fetchTickets = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("tickets")
            .select(
              `
              *,
              clientes (nombre, apellido, empresa)
            `
            )
            .eq("vendedor_id", currentUser.id)
            .order("fecha_creacion", { ascending: false });

          if (error) throw error;
          setTickets(data || []);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error desconocido");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchTickets();
    }, [currentUser]);

    return { tickets, loading, error };
  };

  // Hook para obtener pedidos
  const usePedidos = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    const { currentUser } = useAuth();

    useEffect(() => {
      if (!currentUser) return;

      const fetchPedidos = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("pedidos")
            .select(
              `
              *,
              clientes (nombre, apellido, empresa),
              productos_pedido (*)
            `
            )
            .eq("vendedor_id", currentUser.id)
            .order("fecha_creacion", { ascending: false });

          if (error) throw error;
          setPedidos(data || []);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error desconocido");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchPedidos();
    }, [currentUser]);

    return { pedidos, loading, error };
  };

  // Hook para obtener oportunidades (pipeline)
  const useOportunidades = () => {
    const { currentUser } = useAuth();

    const [oportunidades, setOportunidades] = useState<Oportunidad[]>([]);

    useEffect(() => {
      if (!currentUser) return;

      const fetchOportunidades = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("oportunidades")
            .select(
              `
              *,
              clientes (nombre, apellido, empresa)
            `
            )
            .eq("vendedor_id", currentUser.id)
            .order("fecha_creacion", { ascending: false });

          if (error) throw error;
          setOportunidades(data || []);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error desconocido");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchOportunidades();
    }, [currentUser]);

    return { oportunidades, loading, error };
  };

  // Funciones para crear registros
  const crearCliente = async (
    clienteData: Partial<Cliente>,
    currentUser: User
  ) => {
    if (!currentUser) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from("clientes")
      .insert({
        ...clienteData,
        vendedor_id: currentUser.id,
      })
      .select();

    if (error) throw error;

    return data;
  };

  const crearActividad = async (
    actividadData: Actividad,
    currentUser: User
  ) => {
    if (!currentUser) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from("actividades")
      .insert({
        ...actividadData,
        vendedor_id: currentUser.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const crearReunion = async (reunionData: Reunion, currentUser: User) => {
    if (!currentUser) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from("reuniones")
      .insert({
        ...reunionData,
        vendedor_id: currentUser.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const crearTicket = async (ticketData: Ticket, currentUser: User) => {
    if (!currentUser) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from("tickets")
      .insert({
        ...ticketData,
        vendedor_id: currentUser.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const crearPedido = async (pedidoData: Pedido, currentUser: User) => {
    if (!currentUser) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from("pedidos")
      .insert({
        ...pedidoData,
        vendedor_id: currentUser.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const actualizarCliente = async (clienteData: Cliente, currentUser: User) => {
    if (!currentUser) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from("clientes")
      .update(clienteData)
      .eq("id", clienteData.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return {
    useClientes,
    useActividades,
    useReuniones,
    useTickets,
    usePedidos,
    useOportunidades,
    crearCliente,
    crearActividad,
    crearReunion,
    crearTicket,
    crearPedido,
    actualizarCliente,
    loading,
    error,
  };
};
