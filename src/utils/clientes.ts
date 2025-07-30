import { Cliente } from "../types";

export const cliente = (
  cliente_id: string | undefined,
  clientes: Cliente[]
) => {
  if (!cliente_id || !clientes) return;
  return clientes?.find((c) => c.id === cliente_id);
};


  export const clientesActivos = (
    clientes: Cliente[] | undefined
  ) =>
    clientes?.filter((cliente) => cliente.estado === "activo") ?? [];

  export const clientesNuevos = (
    clientes: Cliente[] | undefined
  ) =>    clientes?.filter((cliente) => new Date(cliente.fecha_creacion).getMonth() === 
    new Date().getMonth()) ?? [];

    export const clientesNuevosMes = (cliente: Cliente[] | undefined, mes: number) => {
      return cliente?.filter((c) => new Date(c.fecha_creacion).getMonth() === mes).length;
    }

    export const getEtapaColor = (etapa: string) => {
    switch (etapa) {
      case "inicial":
        return "bg-gray-100 text-gray-800";
      case "calificado":
        return "bg-blue-100 text-blue-800";
      case "propuesta":
        return "bg-yellow-100 text-yellow-800";
      case "negociacion":
        return "bg-orange-100 text-orange-800";
      case "cerrado":
        return "bg-green-100 text-green-800";
      case "perdido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

    export const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "cliente":
        return "bg-green-100 text-green-800";
      case "prospecto":
        return "bg-blue-100 text-blue-800";
      case "inactivo":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };