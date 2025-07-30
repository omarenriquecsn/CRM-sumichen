import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import { User } from "@supabase/supabase-js";
import {
  Actividad,
  Cliente,
  formProducto,
  ICrearReunion,
  Oportunidad,
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
          credentials: "include",
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
          credentials: "include",
          body: JSON.stringify(clienteData),
        }).then(async (response) => {
          if (!response.ok) {
            throw new Error("El cliente ya existe o hubo un error al crearlo");
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
        await fetch(`${URL}/clientes/${clienteData.id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(clienteData),
        }).then((response) => {
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
          credentials: "include",
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
    archivoAdjunto: File | null;
  };

  // Hook para crear pedido
  const useCrearPedido = () => {
    return useMutation({
      mutationFn: async ({
        pedidoData,
        productosPedido,
        currentUser,
        archivoAdjunto,
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
        let pedidoId = null;
        await fetch(`${URL}/pedidos`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            ...pedidoDB,
            productos: productosFormateados,
          }),
        }).then(async (response) => {
          if (!response.ok) {
            throw new Error("Error al crear el pedido");
          }
          // Obtener el id del pedido creado
          const data = await response.json();
          pedidoId = data.id || data.pedido_id || null;
        });

        // 2. Si hay archivo adjunto y se obtuvo el id, subirlo a /pedidos/:id/evidencia
        if (archivoAdjunto && pedidoId) {
          const formData = new FormData();
          formData.append("file", archivoAdjunto);
          await fetch(`${URL}/pedidos/${pedidoId}/evidencia`, {
            method: "POST",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
              // No poner Content-Type, el navegador lo setea automáticamente para FormData
            },
            body: formData,
          }).then((response) => {
            if (!response.ok) {
              throw new Error("Error al subir la evidencia del pedido");
            }
          });
        }
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
  const useActividades = () => {
    const { currentUser } = useAuth();
    return useQuery({
      queryKey: ["actividades", currentUser?.id],
      queryFn: async () => {
        if (!currentUser) return [];
        const ActividadesData = await fetch(
          `${URL}/actividades/${currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
            credentials: "include",
          }
        ).then((response) => response.json());
        const data: Promise<Actividad[]> = ActividadesData;
        return data || [];
      },
      enabled: !!currentUser,
    });
  };


  type CrearActividadParams = {
    actividadData: Partial<Actividad>;
    currentUser: Partial<User>;
  };
  // Hook para crear actividad
  const useCrearActividad = () => {
    return useMutation({
      mutationFn: async ({
        actividadData,
        currentUser,
      }: CrearActividadParams) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        await fetch(`${URL}/actividades`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
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
        const reunionesData = await fetch(
          `${URL}/reuniones/${currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
            credentials: "include",
          }
        ).then((response) => response.json());
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
          credentials: "include",
        }).then((response) => response.json());
        const data: Promise<Ticket[]> = ticketsData;
        return (await data).length > 0 ? data : [];
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
        const oportunidadData = await fetch(
          `${URL}/oportunidades/${currentUser.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Autorization: `Bearer ${session?.access_token}`,
            },
            credentials: "include",
          }
        ).then((res) => res.json());
        const data: Promise<Oportunidad[]> = oportunidadData;
        return data || [];
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
          credentials: "include",
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
          credentials: "include",
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

  // hook para crear tickets
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
          credentials: "include",
          body: JSON.stringify({ ...ticketData, vendedor_id: currentUser.id }),
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

  // hook para crear Oportunidades
  const useCrearOportunidades = () => {
    return useMutation({
      mutationFn: async ({
        oportunidadData,
        currentUser,
      }: {
        oportunidadData: Partial<Oportunidad>;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        await fetch(`${URL}/oportunidades`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Autorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
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

  // Hook para actualizar Oportunidades
  const useActualizarOportunidad = () => {
    return useMutation({
      mutationFn: async ({
        OportunidadData,
        currentUser,
      }: {
        OportunidadData: Partial<Oportunidad>;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        await fetch(`${URL}/oportunidades/${OportunidadData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
          body: JSON.stringify(OportunidadData),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar la reunion");
          }
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
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
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

  // Actualizar Tickets
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
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
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

  // Actualizar Pedidos
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
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
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

  // Hook para obtener metas
  const useMetas = () => {
    const { currentUser, session } = useAuth();
    return useQuery({
      queryKey: ["metas"],
      queryFn: async () => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const metas = await fetch(`${URL}/metas/${currentUser?.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
        }).then((response) => response.json());
        return metas || [];
      },
      staleTime: 1000 * 60 * 5,
      retry: 1,
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
    useActualizarOportunidad,
    useProductos,
    useMetas,
  };
};
