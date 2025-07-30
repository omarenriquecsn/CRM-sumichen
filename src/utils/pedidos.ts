import { User } from "@supabase/supabase-js";
import { Cliente, formProducto, Pedido, PedidoData } from "../types";
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
      archivoAdjunto: File | null;
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
  if (
    !data.productos ||
    !Array.isArray(data.productos) ||
    data.productos.length === 0
  ) {
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
    (sum, p) =>
      sum + (Number(p.precio_unitario) || 0) * (Number(p.cantidad) || 0),
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
      archivoAdjunto: data.archivoAdjunto || null,
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

export const utilsPedidos = (pedidos: Pedido[], cliente: Cliente) => {
  const pedidosFiltrados = () => {
    const pedidosFiltradosVendedor = (
      Array.isArray(pedidos) ? pedidos : []
    ).filter((pedido) => pedido.cliente_id === cliente.id);
    return pedidosFiltradosVendedor;
  };
  const hoy = new Date();

  const ultimaCompra =
    pedidosFiltrados()?.length ?? 0 > 0
      ? pedidosFiltrados()?.reduce((prev: Pedido, curr: Pedido) => {
          const fechaPrev = new Date(prev.fecha_creacion);
          const fechaCurr = new Date(prev.fecha_creacion);

          const diffPrev = Math.abs(hoy.getDate() - fechaPrev.getDate());
          const diffCurr = Math.abs(hoy.getDate() - fechaCurr.getDate());

          return diffCurr < diffPrev ? curr : prev;
        })
      : null;

  const abrirGmail = () => {
    const destinatario = encodeURIComponent(cliente.email);
    const asunto = encodeURIComponent("¡Hola desde Sumichem!");
    const cuerpo = encodeURIComponent(
      `Estimado ${cliente.nombre}, nos alegra contactarte.`
    );

    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${destinatario}&su=${asunto}&body=${cuerpo}`;

    window.open(url, "_blank"); // Abre Gmail en nueva pestaña
  };
  return {
    pedidosFiltrados,
    ultimaCompra,
    abrirGmail,
  };
};
