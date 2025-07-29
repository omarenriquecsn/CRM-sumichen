
import { User } from "@supabase/supabase-js";
import { formProducto, Pedido, PedidoData,  } from "../types";
import { toast } from "react-toastify";



export interface HandleCrearPedidoParams {
  data: PedidoData;
  currentUser: User;
  clienteSeleccionado: string | null;
  nuevoPedido: (
    params: {
      pedidoData: Partial<Pedido>;
      currentUser: User;
      productosPedido: formProducto[];
    },
    callbacks: {
      onError: (error: unknown) => void;
      onSuccess: () => void;
    }
  ) => void;
  setModalPedidoVisible: (v: boolean) => void;
}

export function handleCrearPedidoUtil({
  data,
  currentUser,
  clienteSeleccionado,
  nuevoPedido,
  setModalPedidoVisible,
}: HandleCrearPedidoParams) {
  if (!currentUser) {
    toast.error("Debes iniciar sesión para crear un pedido");
    return;
  }
  if (!data.productos || !Array.isArray(data.productos) || data.productos.length === 0) {
    toast.error("Debes agregar al menos un producto al pedido");
    return;
  }

  // Asignar cliente si no viene en data
  if (!data.cliente_id && clienteSeleccionado) {
    data.cliente_id = clienteSeleccionado;
  }

  const { productos, ...rest } = data;

  // Calcular subtotal y total de forma robusta
  const subtotal = productos.reduce(
    (sum, p) => sum + (Number(p.precio_unitario) || 0) * (Number(p.cantidad) || 0),
    0
  );
  const impuestos = Number(rest.impuestos) || 0;
  rest.subtotal = subtotal;
  rest.total = subtotal + subtotal * impuestos;

  nuevoPedido(
    {
      pedidoData: { ...rest },
      currentUser,
      productosPedido: productos,
    },
    {
      onError: async (error: unknown) => {
        let errorMsg = "Error al crear el pedido";
        if (error instanceof Error) {
          errorMsg = error.message;
        }
        toast.error(errorMsg);
      },
      onSuccess: () => {
        toast.success("¡Pedido creado exitosamente!");
        setModalPedidoVisible(false);
      },
    }
  );
}


export const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "borrador":
      return "bg-gray-100 text-gray-800";
    case "enviado":
      return "bg-blue-100 text-blue-800";
    case "aprobado":
      return "bg-green-100 text-green-800";
    case "rechazado":
      return "bg-red-100 text-red-800";
    case "procesando":
      return "bg-yellow-100 text-yellow-800";
    case "completado":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};


