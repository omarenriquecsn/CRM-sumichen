import useVendedores from "../hooks/useVendedores";
import { useSupabase } from "../hooks/useSupabase";
import { Vendedor } from "../types";

const PanelAdmin = () => {
  const { data: pedidos } = useSupabase().usePedidos();
  const { data: vendedores } = useVendedores();
  const { data: clientes } = useSupabase().useClientes();

  // Calculo de clientes activos
  const clientesActivos = Array.isArray(clientes)
    ? clientes.filter((cliente) => cliente.estado === "activo")
    : [];

  // Calculo de ventas cerradas
  const ventasCerradas = Array.isArray(pedidos)
    ? pedidos.filter((pedido) => pedido.estado === "procesado")
    : [];

  // Calculo de cantidad clientes activos
  const CantidadClientesActivos = Array.isArray(clientes)
    ? clientes.filter((cliente) => cliente.estado === "activo").length
    : 0;

  // Calculo de valor ventas cerradas
  const valorVentasCerradas = Array.isArray(pedidos)
    ? pedidos
        .filter((pedido) => pedido.estado === "procesado")
        .reduce((total, pedido) => total + pedido.total, 0)
    : 0;

  // Calculo de pedidos por vendedor
  const pedidosPorVendedor = (vendedorId: string) => {
    return Array.isArray(pedidos)
      ? pedidos.filter((pedido) => pedido.vendedor_id === vendedorId)
      : [];
  };

  // Calculo de cantidad vendedores
  const cantidadVendedores = Array.isArray(vendedores) ? vendedores.length : 0;

  // Calculo de cantidad clientes
  const cantidadClientes = Array.isArray(clientes) ? clientes.length : 0;

  // Calculo de incremento vendedores
  const calculoIncrementoVendedores = () => {
    const vendedoresAnteriores = Array.isArray(vendedores)
      ? vendedores.map(
          (vendedor: Vendedor) =>
            new Date(vendedor.fecha_creacion).getMonth() ===
            new Date().getMonth() - 1
        )
      : [];

    // Vendedores actuales
    const vendedoresActuales = Array.isArray(vendedores)
      ? vendedores.map(
          (vendedor: Vendedor) =>
            new Date(vendedor.fecha_creacion).getMonth() ===
            new Date().getMonth()
        )
      : [];

    // Calculo de clientes por vendedor

    //  Calculo de incremento vendedores
    const restaVendedores =
      vendedoresActuales.length - vendedoresAnteriores.length;
    const incremento = restaVendedores > 0 ? restaVendedores : 0;
    return incremento;
  };

  const clientesPorVendedor = (vendedorId: string) => {
    return Array.isArray(clientes)
      ? clientes.filter((cliente) => cliente.vendedor_id === vendedorId)
      : [];
  };

  // Top Vendedores
  const topVendedores = Array.isArray(vendedores)
    ? vendedores.sort((a, b) => b.total - a.total).slice(0, 4)
    : [];

  const VendedoresTop = topVendedores.map((vendedor, index) => ({
    id: index + 1,
    nombre: `${vendedor.nombre} ${vendedor.apellido}`,
    ventas: Array.isArray(pedidos)
      ? pedidosPorVendedor(vendedor.id).reduce(
          (total, pedido) => total + pedido.total,
          0
        )
      : 0,
    meta: 100,
    clientes: Array.isArray(clientes)
      ? clientesPorVendedor(vendedor.id).length
      : 0,
    avatar: vendedor.nombre.charAt(0) + vendedor.apellido.charAt(0),
  }));

  return {
    cantidadVendedores,
    ventasCerradas,
    cantidadClientes,
    CantidadClientesActivos,
    clientesActivos,
    valorVentasCerradas,
    calculoIncrementoVendedores,
    VendedoresTop,
  };
};

export default PanelAdmin;
