import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import { User } from "@supabase/supabase-js";
import {
  Actividad,
  Cliente,
  formProducto,
  ICrearActividad,
  ICrearReunion,
  ICreateOportunidad,
  Pedido,
  PedidoDb,
  // PedidoDb,
  ProductoDb,
  // ProductoPedido,
  Reunion,
} from "../types";
import { Ticket } from "../types";

export const useSupabase = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const queryClient = useQueryClient();
  const { session } = useAuth();

  // Hook para obtener clientes
  const useClientes = () => {
    const { currentUser, session } = useAuth();
    return useQuery<Cliente[]>({
      queryKey: ["clientes", currentUser?.id],
      queryFn: async () => {
        if (!currentUser || !session?.access_token)
          throw new Error("Usuario no logueado o sin sesión");
        const clientesData = await fetch(`${URL}/clientes/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });
        const data: Promise<Cliente[]> = await clientesData.json();
        return data || [];
      },
      enabled: !!currentUser,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    });
  };

  // Hook para crear cliente
  const useCrearCliente = () => {
    return useMutation({
      mutationFn: async ({
        clienteData,
        currentUser,
      }: {
        clienteData: Partial<Cliente>;
        currentUser: User;
      }) => {
        if (!currentUser || !session?.access_token)
          throw new Error("Usuario no autenticado o no hay token");

        clienteData.vendedor_id = currentUser.id;
        await fetch(`${URL}/clientes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(clienteData),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al crear el cliente");
          }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["clientes"] });
      },
    });
  };

  // Hook para Actualizar Clientes
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
        console.log(clienteData, "Cliente Data");
        await fetch(`${URL}/clientes/${clienteData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(clienteData),
        }).then((response) => {
          console.log(response);
          if (!response.ok) {
            throw new Error("Error al actualizar el cliente");
          }
        });
      },

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["clientes"] });
      },
    });
  };

  // Hook para obtener pedidos
  const usePedidos = () => {
    const { currentUser, session } = useAuth();
    return useQuery({
      queryKey: ["pedidos", currentUser?.id],
      queryFn: async () => {
        if (!currentUser || !session?.access_token)
          throw new Error("Usuario no logueado o sin sesión");
        const pedidosData = await fetch(`${URL}/pedidos/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });
        const data: Promise<Pedido[]> = await pedidosData.json();
        return data || [];
      },
      enabled: !!currentUser,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    });
  };

  type CrearPedidoParams = {
    pedidoData: Partial<Pedido>;
    productosPedido: formProducto[];
    currentUser: User;
  };

  // Hook para crear pedido
  const useCrearPedido = () => {
    return useMutation({
      mutationFn: async ({
        pedidoData,
        productosPedido,
        currentUser,
      }: CrearPedidoParams) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const pedidoDB: PedidoDb = {
          vendedor_id: currentUser.id,
          cliente_id: pedidoData.cliente_id || "",
          impuestos:
            pedidoData.impuestos && pedidoData.impuestos > 0 ? "iva" : "exento",
          moneda: pedidoData.moneda || "usd",
          tipo_pago: pedidoData.tipo_pago || "contado",
          transporte: pedidoData.transporte || "interno",
          dias_credito: pedidoData.dias_credito,
          fecha_entrega: pedidoData.fecha_entrega || new Date(),
        };
        const productosFormateados = productosPedido.map((p: ProductoDb) => ({
          producto_id: p.producto_id,
          cantidad: p.cantidad,
          precio_unitario: p.precio_unitario,
        }));
        // 1. Crear el pedido
        await fetch(`${URL}/pedidos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            ...pedidoDB,
            productos: productosFormateados,
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al crear el pedido");
          }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      },

      onError: (error: unknown) => {
        if (error instanceof Error) throw new Error(error.message);
      },
    });
  };

  // Hook para obtener actividades
  const useActividades = (clienteId?: string) => {
    const { currentUser } = useAuth();
    return useQuery({
      queryKey: ["actividades", currentUser?.id, clienteId],
      queryFn: async () => {
        if (!currentUser) return [];
        const ActividadesData = await fetch(`${URL}/actividades`, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }).then((response) => response.json());
        const data: Promise<Actividad[]> = ActividadesData;
        return data || [];
      },
      enabled: !!currentUser,
    });
  };

  // Hook para crear actividad
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
        await fetch(`${URL}/actividades`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(actividadData),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al crear la actividad");
          }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["actividades"] });
      },
    });
  };

  // Hook para obtener reuniones
  const useReuniones = () => {
    const { currentUser } = useAuth();
    return useQuery({
      queryKey: ["reuniones", currentUser?.id],
      queryFn: async () => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const reunionesData = await fetch(`${URL}/reuniones`, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }).then((response) => response.json());
        const data: Promise<Reunion[]> = reunionesData;
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
        if (!currentUser) throw new Error("Usuario no autenticado");
        const ticketsData = await fetch(`${URL}/tickets/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        }).then((response) => response.json());
        const data: Promise<Ticket[]> = ticketsData;
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
        if (!currentUser) throw new Error("Usuario no autenticado");
        const reunionesDataB = await fetch(`${URL}/reuniones`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Autorization: `Bearer ${session?.access_token}`,
          },
        }).then((res) => res.json);
        return reunionesDataB;
      },
      enabled: !!currentUser,
    });
  };

  // Hook para obtener productos
  const useProductos = () => {
    return useQuery({
      queryKey: ["productos"],
      queryFn: async () => {
        const productos = await fetch(`${URL}/productos`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Autorization: `Bearer ${session?.access_token}`,
          },
        }).then((response) => response.json());
        return productos || [];
      },
      staleTime: 1000 * 60 * 5,
      retry: 1,
    });
  };

  // hook para crear Reuniones
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
        await fetch(`${URL}/reuniones`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(reunionData),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al crear la reunion");
          }
        });
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
        ticketData: Partial<Ticket>;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        await fetch(`${URL}/tickets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Autorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({...ticketData, vendedor_id: currentUser.id}),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al crear el ticket");
          }
          return response.json().then((data) => {
            return data;
          });
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
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
        await fetch(`${URL}/oportunidades`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Autorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(oportunidadData),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al crear la oportunidad");
          }
          return response.json().then((data) => {
            return data;
          });
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["oportunidades"] });
      },
    });
  };

  // Actualizar Reuniones
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
        await fetch(`${URL}/reuniones/${ReunionData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Autorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(ReunionData),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar la reunion");
          }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["reuniones"] });
      },
    });
  };

  const useActualizarTicket = () => {
    return useMutation({
      mutationFn: async ({
        TicketData,
        currentUser,
      }: {
        TicketData: Partial<Ticket>;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no Autenticado");
        await fetch(`${URL}/tickets/${TicketData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Autorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(TicketData),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar el ticket");
          }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      },
    });
  };

  const useActualizarPedido = () => {
    return useMutation({
      mutationFn: async ({
        PedidoData,
        currentUser,
      }: {
        PedidoData: Partial<Pedido>;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error();
        await fetch(`${URL}/pedidos/${PedidoData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Autorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(PedidoData),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar el pedido");
          }
          return response.json().then((data) => {
            return data;
          });
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });
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
    useActualizarTicket,
    useActualizarPedido,
    useProductos,
  };
};
