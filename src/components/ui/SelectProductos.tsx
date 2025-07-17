import { useState } from "react";
import { formProducto, Producto } from "../../types";
import { toast } from "react-toastify";
import Select from 'react-select';


// Define el tipo para las opciones que usará react-select.
// Extiende Producto para incluir todas sus propiedades.
type ProductoSelectOption = Producto & {
  value: string;
  label: string;
};

type SelectorDeProductosProps = { 
  productos: Producto[];
  onSeleccionar: (
    seleccion: { producto_id: string; cantidad: number; precio_unitario: number, nombre: string, descripcion: string }[]
    ) => void;
};

const SelectorDeProductos = ({ productos, onSeleccionar }: SelectorDeProductosProps) => {
  const [selectedOption, setSelectedOption] = useState<ProductoSelectOption | null>(null);
  const [seleccion, setSeleccion] = useState<
    formProducto[]
  >([]);

  const toggleProducto = (producto: Producto) => {
    
    if (!producto.id || !producto.precio_unitario || !producto.nombre || !producto.descripcion) {
        console.error("Producto con datos incompletos:", producto);
        toast.error("Este producto no se puede agregar debido a datos incompletos.");
        return;
      }

    const existe = seleccion.find((p) => p.producto_id === producto.id);
    if (existe) {
      setSeleccion((prev) => prev.filter((p) => p.producto_id !== producto.id));
    } else {
      setSeleccion((prev) => [
        ...prev,
        {
          producto_id: producto.id,
          cantidad: 1,
          precio_unitario: producto.precio_unitario,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
        },
      ]);
    }
  };

  const cambiarCantidad = (id: string, cantidad: number) => {
    setSeleccion((prev) =>
      prev.map((p) =>
        p.producto_id === id ? { ...p, cantidad: Number(cantidad) } : p
      )
    );
  };

  const eliminarProducto = (productoId: string) => {
    setSeleccion(prev => prev.filter(p => p.producto_id !== productoId));
  };

  const handleAddProduct = () => {
    if (selectedOption) {
      toggleProducto(selectedOption);
      setSelectedOption(null); // Reset the selected option after adding
    }
  };

  return (
    <div className="space-y-4">
      <Select<ProductoSelectOption>
        options={productos.map((p) => ({ ...p, value: p.id, label: p.nombre }))}
        value={selectedOption}
        onChange={(option) => setSelectedOption(option)}
        placeholder="Seleccione un producto..."
        isClearable
        isSearchable
      />
      <button
        type="button"
        onClick={handleAddProduct}
        disabled={!selectedOption}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Agregar Producto
      </button>

      {seleccion.length > 0 && (
        <div>
          <p className="font-semibold">Productos Seleccionados:</p>
          {seleccion.map((producto) => (
            <div key={producto.producto_id} className="flex items-center justify-between py-2">
              <span>
                {producto.nombre} (Cantidad: {producto.cantidad}, Precio: ${producto.precio_unitario})
              </span>
              <input
                type="number"
                min={1}
                value={producto.cantidad}
                onChange={(e) => cambiarCantidad(producto.producto_id, Number(e.target.value))}
                className="w-16 border rounded px-2 py-1"
              />
              <button
                onClick={() => eliminarProducto(producto.producto_id)}
                className="ml-2 text-red-600 hover:text-red-800"
              >X
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => onSeleccionar(seleccion)}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Confirmar Productos
      </button>
    </div>
  );
};


export default SelectorDeProductos;