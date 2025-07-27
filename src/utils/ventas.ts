import { Cliente, Pedido, Oportunidad, Actividad, Mes } from "../types";
import { clientesNuevosMes } from "./clientes";
export const calculoIncremento = (
  valorFinal: Cliente[] | Pedido[] | Oportunidad[] | Actividad[]
) => {
  const valorInicial = valorFinal.filter(
    (valor) =>
      new Date(valor.fecha_creacion).getMonth() !== new Date().getMonth()
  );
  let incremento: number;
  if (valorInicial.length === 0) {
    incremento = valorFinal.length > 0 ? 100 : 0;
  } else {
    incremento =
      ((valorFinal.length - valorInicial.length) / valorInicial.length) * 100;
  }
  return incremento;
};

export const tasaDeConversion = (oportunidades: Oportunidad[] | undefined) => {
  if (!oportunidades) return 0;
  const totalOportunidades = oportunidades?.length;
  const oportunidadesCerradas = oportunidades?.filter(
    (oportunidad) => oportunidad.etapa === "cerrado"
  );

  const tasaDeConversion =
    (oportunidadesCerradas.length / totalOportunidades) * 100;
  return tasaDeConversion;
};

export const ventasPorMes = (
  pedidos: Pedido[] | undefined,
  mes: number
): number => {
  return (
    pedidos
      ?.filter((pedido) => new Date(pedido.fecha_creacion).getMonth() === mes)
      .reduce((total, pedido) => total + Number(pedido.total), 0) ?? 0
  );
};

export const atras5meses = (ventasPorMes: Mes[]) => {
  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const mesActual = new Date().getMonth();

  const mesesAtras = [];
  for (let i = 0; i < 11; i++) {
    if (ventasPorMes[i].mes === meses[mesActual]) {
      mesesAtras.push(ventasPorMes[i]);
      if (ventasPorMes[i - 1]) {
        mesesAtras.push(ventasPorMes[i - 1]);
      }
      if (ventasPorMes[i - 2]) {
        mesesAtras.push(ventasPorMes[i - 2]);
      }
      if (ventasPorMes[i - 3]) {
        mesesAtras.push(ventasPorMes[i - 3]);
      }
      if (ventasPorMes[i - 4]) {
        mesesAtras.push(ventasPorMes[i - 4]);
      }
    }
  }

  return mesesAtras;
};

export const arrayMeses = (pedidos: Pedido[], clientes: Cliente[] | undefined) =>{
  const losMeses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  const meses = []
  for (let i = 0; i < 12; i++) {
    meses.push({ mes: losMeses[i], ventas: ventasPorMes(pedidos, i) , clientes: clientesNuevosMes(clientes, i)  })

  }
  
  return meses
}
