import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import { User } from "@supabase/supabase-js";
import {
  Actividad,
  Cliente,
  formProducto,
  Oportunidad,
  Pedido,
  PedidoDb,
  Producto,
  // PedidoDb,
  ProductoDb,
  // ProductoPedido,
  Reunion,
  Vendedor,
} from "../types";
import { Ticket } from "../types";
import useVendedores from "./useVendedores";

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
        currentUser: Partial<User>;
      }) => {
        if (!currentUser || !session?.access_token)
          throw new Error("Usuario no autenticado o no hay token");

        if (!currentUser.id) throw new Error("Usuario no autenticado");
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
        clienteData: Partial<Cliente>;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        if (clienteData.etapa_venta === "cerrado" && clienteData.estado !== "inactivo") {
          clienteData.estado = "activo";
        }
        if (clienteData.etapa_venta === "inicial" && clienteData.estado !== "inactivo") {
          clienteData.estado = "prospecto";
        }
        
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
    archivoAdjunto: FileList | null;
  };

  // Hook para crear pedido
  const useCrearPedido = () => {
    const { data: clientes } = useClientes();
    const { data: vendedores } = useVendedores();
    return useMutation({
      mutationFn: async ({
        pedidoData,
        productosPedido,
        currentUser,
        archivoAdjunto,
      }: CrearPedidoParams) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const cliente = clientes?.find(
          (c: Cliente) => c.id === pedidoData.cliente_id
        );
        const vendedor = vendedores?.find(
          (v: Vendedor) => v.id === cliente?.vendedor_id
        );

        const pedidoDB: PedidoDb = {
          vendedor_id: vendedor?.id || currentUser.id,
          cliente_id: pedidoData.cliente_id || "",
          impuestos:
            pedidoData.impuestos && pedidoData.impuestos > 0 ? "iva" : "exento",
          moneda: pedidoData.moneda || "usd",
          tipo_pago: pedidoData.tipo_pago || "contado",
          transporte: pedidoData.transporte || "interno",
          dias_credito: pedidoData.dias_credito,
          fecha_entrega: pedidoData.fecha_entrega || new Date(),
          notas: pedidoData.notas,
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
          Array.from(archivoAdjunto).forEach((file) => {
            formData.append("files", file);
          });
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
    const { data: clientes } = useClientes();
    const { data: vendedores } = useVendedores();
    return useMutation({
      mutationFn: async ({
        actividadData,
        currentUser,
      }: CrearActividadParams) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const cliente = clientes?.find(
          (c: Cliente) => c.id === actividadData.cliente_id
        );
        const vendedor = vendedores?.find(
          (v: Vendedor) => v.id === cliente?.vendedor_id
        );
        actividadData.vendedor_id = vendedor?.id || currentUser.id;
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
              Authorization: `Bearer ${session?.access_token}`,
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
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
        }).then((response) => response.json());
        return productos || [];
      },
      staleTime: 1000 * 60 * 5,
      retry: 1,
    });
  };

  //Hook para crear productos
  const useCrearProducto = () => {
    return useMutation({
      mutationFn: async ({
        productoData,
      }: {
        productoData: Partial<Producto>;
      }) => {
        const response = await fetch(`${URL}/productos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
          body: JSON.stringify(productoData),
        });
        if (!response.ok) {
          throw new Error("Error al crear el producto");
        }
        return response.json();
      },
    });
  };

  // hook para crear Reuniones
  const useCrearReunion = () => {
    const { data: clientes } = useClientes();
    const { data: vendedores } = useVendedores();
    return useMutation({
      mutationFn: async ({
        reunionData,
        currentUser,
      }: {
        reunionData: Partial<Reunion>;
        currentUser: Partial<User>;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const cliente = clientes?.find(
          (c: Cliente) => c.id === reunionData.cliente_id
        );
        const vendedor = vendedores?.find(
          (v: Vendedor) => v.id === cliente?.vendedor_id
        );
        reunionData.vendedor_id = vendedor?.id || currentUser.id;

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
        queryClient.invalidateQueries({ queryKey: ["actividades"] });
      },
    });
  };

  // hook para crear tickets
  const useCrearTicket = () => {
    const { data: clientes } = useClientes();
    const { data: vendedores } = useVendedores();
    return useMutation({
      mutationFn: async ({
        ticketData,
        currentUser,
      }: {
        ticketData: Partial<Ticket>;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const cliente = clientes?.find(
          (c: Cliente) => c.id === ticketData.cliente_id
        );
        const vendedor = vendedores?.find(
          (v: Vendedor) => v.id === cliente?.vendedor_id
        );
        ticketData.vendedor_id = vendedor?.id || currentUser.id;

        await fetch(`${URL}/tickets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
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
    const { data: clientes } = useClientes();
    const { data: vendedores } = useVendedores();
    return useMutation({
      mutationFn: async ({
        oportunidadData,
        currentUser,
      }: {
        oportunidadData: Partial<Oportunidad>;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error("Usuario no autenticado");
        const cliente = clientes?.find(
          (c: Cliente) => c.id === oportunidadData.cliente_id
        );
        const vendedor = vendedores?.find(
          (v: Vendedor) => v.id === cliente?.vendedor_id
        );
        oportunidadData.vendedor_id = vendedor?.id || currentUser.id;

        await fetch(`${URL}/oportunidades`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
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
        pedidoData,
        currentUser,
      }: {
        pedidoData: Partial<Pedido>;
        currentUser: User;
      }) => {
        if (!currentUser) throw new Error();
        await fetch(`${URL}/pedidos/${pedidoData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
          body: JSON.stringify(pedidoData),
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

  const useCancelarPedido = () => {
    const { session } = useAuth();
    return useMutation({
      mutationFn: async (id: string) => {
        await fetch(`${URL}/pedidos/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al cancelar el pedido");
          }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      },
    });
  };

  const useActualizarActividad = () => {
    const { session } = useAuth();
    return useMutation({
      mutationFn: async (actividadData: Partial<Actividad>) => {
        await fetch(`${URL}/actividades/${actividadData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
          body: JSON.stringify(actividadData),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar la actividad");
          }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["actividades"] });
      },
    });
  };

  const useEliminarActividad = () => {
    const { session } = useAuth();
    return useMutation({
      mutationFn: async (actividad: Actividad) => {
        if (actividad.tipo === "reunion") {
          await fetch(`${URL}/reuniones/${actividad.id_tipo_actividad}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            },
            credentials: "include",
          }).then((response) => {
            if (!response.ok) {
              throw new Error("Error al eliminar la reunión");
            }
          });
        }

        if (actividad.tipo === "tarea" && actividad.id_tipo_actividad) {
          await fetch(`${URL}/tickets/${actividad.id_tipo_actividad}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            },
            credentials: "include",
          }).then((response) => {
            if (!response.ok) {
              throw new Error("Error al eliminar el ticket");
            }
          });
        }

        if (actividad.tipo === "reunion" && actividad.id_tipo_actividad) {
          await fetch(`${URL}/reuniones/${actividad.id_tipo_actividad}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token}`,
            },
            credentials: "include",
          }).then((response) => {
            if (!response.ok) {
              throw new Error("Error al eliminar la reunión");
            }
          });
        }

        await fetch(`${URL}/actividades/${actividad.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al eliminar la actividad");
          }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["actividades"] });
        queryClient.invalidateQueries({ queryKey: ["reuniones"] });
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      },
    });
  };

  const useEliminarReunion = () => {
    const { session } = useAuth();
    return useMutation({
      mutationFn: async (id: string) => {
        await fetch(`${URL}/reuniones/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al eliminar la reunión");
          }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["reuniones"] });
      },
    });
  };

  const useEliminarTicket = () => {
    const { session } = useAuth();
    return useMutation({
      mutationFn: async (id: string) => {
        await fetch(`${URL}/tickets/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al eliminar el ticket");
          }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      },
    });
  };

  const useEliminarOportunidad = () => {
    const { session } = useAuth();
    return useMutation({
      mutationFn: async (id: string) => {
        await fetch(`${URL}/oportunidades/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          credentials: "include",
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error al eliminar la oportunidad");
          }
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["oportunidades"] });
      },
    });
  };

  return {
    useClientes,
    useActividades,
    useReuniones,
    useEliminarReunion,
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
    useCancelarPedido,
    useActualizarActividad,
    useEliminarActividad,
    useEliminarTicket,
    useEliminarOportunidad,
    useCrearProducto,
  };
};
