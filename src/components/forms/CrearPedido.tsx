import { useState } from "react";
import { formProducto, Pedido, PedidoData, Producto } from "../../types";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { toast } from "react-toastify";
import { useSupabase } from "../../hooks/useSupabase";
import SelectorDeProductos from "../ui/SelectProductos";

type CrearPedidoProps = {
  onSubmit: (data: PedidoData) => void;
  accion: string;
};

const CrearPedido = ({ onSubmit, accion }: CrearPedidoProps) => {
  const supabase = useSupabase();

  accion = accion || "Crear Pedido";

  const [productosSeleccionados, setProductosSeleccionados] = useState<
    formProducto[]
  >([]);

  const [formData, setFormData] = useState<Partial<Pedido>>({
    vendedor_id: "",
    cliente_id: "",
    numero: "",
    fecha_creacion: new Date(),
    fecha_entrega: new Date(),
    total: 0,
    subtotal: 0,
    impuestos: 0,
    tipo_pago: "contado",
    dias_credito: 0,
    notas: "",
    transporte: "interno",
    moneda: "usd",
  });

  // Estado para el archivo adjunto
  const [archivoAdjunto, setArchivoAdjunto] = useState<File | null>(null);

  const {
    data: productos,
    isLoading: loadingProductos,
    error: errorProductos,
  } = supabase.useProductos();

  if (errorProductos) {
    toast.error("Error al cargar los productos");
    return;
  }

  if (loadingProductos) {
    return <LoadingSpinner />;
  }

  if (!productos) {
    toast.error("No hay productos");
    return;
  }

  const handleOnChage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivoAdjunto(e.target.files[0]);
    } else {
      setArchivoAdjunto(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pedidoConProductos = {
      ...formData,
      productos: productosSeleccionados,
      archivoAdjunto, // Se puede enviar como parte del objeto si el backend lo soporta
    } as PedidoData & { archivoAdjunto?: File };
    onSubmit(pedidoConProductos);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 p-6 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Crear Nuevo Pedido
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="fecha_entrega"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha de Entrega
            </label>
            <input
              type="date"
              name="fecha_entrega"
              id="fecha_entrega"
              value={
                formData.fecha_entrega
                  ? new Date(formData.fecha_entrega).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleOnChage}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="tipo_pago"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo de Pago
            </label>
            <select
              name="tipo_pago"
              id="tipo_pago"
              value={formData.tipo_pago}
              onChange={handleOnChage}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm bg-white"
            >
              <option value="contado">Contado</option>
              <option value="credito">Crédito</option>
            </select>
          </div>
          {formData.tipo_pago === "credito" && (
            <div>
              <label
                htmlFor="dias_credito"
                className="block text-sm font-medium text-gray-700"
              >
                Días de Crédito
              </label>
              <input
                type="number"
                name="dias_credito"
                id="dias_credito"
                value={formData.dias_credito}
                onChange={handleOnChage}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="transporte"
              className="block text-sm font-medium text-gray-700"
            >
              Transporte
            </label>
            <select
              name="transporte"
              id="transporte"
              value={formData.transporte}
              onChange={handleOnChage}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm bg-white"
            >
              <option value="interno">Interno</option>
              <option value="externo">Externo</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="impuestos"
              className="block text-sm font-medium text-gray-700"
            >
              Impuestos
            </label>
            <select
              name="impuetos"
              id="impuetos"
              value={formData.impuestos}
              onChange={handleOnChage}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm bg-white"
            >
              <option value="0">IVA</option>
              <option value="0.16">Exento</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="moneda"
              className="block text-sm font-medium text-gray-700"
            >
              Moneda
            </label>
            <select
              name="moneda"
              id="moneda"
              value={formData.moneda}
              onChange={handleOnChage}
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm bg-white"
            >
              <option value="interno">usd</option>
              <option value="externo">bs</option>
            </select>
          </div>
        </div>

        <SelectorDeProductos
          productos={productos}
          onSeleccionar={(seleccion) => setProductosSeleccionados(seleccion)}
        />
        <div>
          <label
            htmlFor="notas"
            className="block text-sm font-medium text-gray-700"
          >
            Notas del Pedido
          </label>
          <textarea
            name="notas"
            id="notas"
            value={formData.notas}
            onChange={(e) =>
              setFormData({ ...formData, notas: e.target.value })
            }
            rows={3}
            className="mt w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        {productosSeleccionados.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold">Resumen de Productos:</h4>
            {productosSeleccionados.map((p) => (
              <p key={p.producto_id}>
                {p.cantidad} x{" "}
                {
                  productos.find((prod: Producto) => prod.id === p.producto_id)
                    ?.nombre
                }{" "}
                = ${(p.cantidad * p.precio_unitario).toFixed(2)}
              </p>
            ))}
          </div>
        )}
        {/* Sección para cargar archivo */}
        <div>
          <label htmlFor="archivoAdjunto" className="block text-sm font-medium text-gray-700">
            Adjuntar archivo (opcional)
          </label>
          <input
            type="file"
            id="archivoAdjunto"
            name="archivoAdjunto"
            onChange={handleArchivoChange}
            className="mt-1 block w-full"
          />
          {archivoAdjunto && (
            <p className="text-sm text-gray-600 mt-1">Archivo seleccionado: {archivoAdjunto.name}</p>
          )}
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 rounded-lg font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {accion}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CrearPedido;
