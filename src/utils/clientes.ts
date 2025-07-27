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
