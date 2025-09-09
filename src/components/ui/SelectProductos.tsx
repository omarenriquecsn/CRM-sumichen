import { useState, useEffect } from "react";
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

  useEffect(() => {
    onSeleccionar(seleccion);
  }, [seleccion, onSeleccionar]);

  const toggleProducto = (producto: Producto) => {
    
    if (!producto.id || !producto.nombre || !producto.descripcion) {
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
          precio_unitario: 0, // Default price to 0, to be edited by user
          nombre: producto.nombre,
          descripcion: producto.descripcion,
        },
      ]);
    }
  };

  const cambiarCantidad = (id: string, cantidad: number) => {
    const nuevaCantidad = Math.max(1, cantidad); // Prevent quantity less than 1
    setSeleccion((prev) =>
      prev.map((p) =>
        p.producto_id === id ? { ...p, cantidad: nuevaCantidad } : p
      )
    );
  };

  const cambiarPrecio = (id: string, precio: number) => {
    const nuevoPrecio = Math.max(0, precio); // Prevent negative prices
    setSeleccion((prev) =>
      prev.map((p) =>
        p.producto_id === id ? { ...p, precio_unitario: nuevoPrecio } : p
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
        options={(Array.isArray(productos) ? productos : []).map((p) => ({ ...p, value: p.id, label: p.nombre }))}
        value={selectedOption}
        onChange={(option) => setSelectedOption(option)}
        placeholder="Seleccione un producto..."
        isClearable
        isSearchable
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
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
        <div className="border-t pt-4 mt-4">
          <p className="font-semibold mb-2">Productos Seleccionados:</p>
          <div className="space-y-3">
            {seleccion.map((producto) => (
              <div key={producto.producto_id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded-lg">
                <span className="md:col-span-5 font-medium text-gray-800">{producto.nombre}</span>
                
                <div className="md:col-span-3">
                  <label htmlFor={`cantidad-${producto.producto_id}`} className="text-xs text-gray-500">Cantidad En Kg</label>
                  <input
                    id={`cantidad-${producto.producto_id}`}
                    type="number"
                    min={0}
                    step="0.01"
                    value={producto.cantidad}
                    onChange={(e) => cambiarCantidad(producto.producto_id, Number(e.target.value))}
                    onFocus={e => {
                      if (e.target.value === "1") {
                        e.target.value = "";
                      }
                    }}
                    className="w-full border rounded px-2 py-1 appearance-none"
                    style={{ MozAppearance: 'textfield' }}
                  />
                  <style>{`
                    input[type=number]::-webkit-inner-spin-button,
                    input[type=number]::-webkit-outer-spin-button {
                      -webkit-appearance: none;
                      margin: 0;
                    }
                    input[type=number] {
                      -moz-appearance: textfield;
                    }
                  `}</style>
                </div>

                <div className="md:col-span-3">
                  <label htmlFor={`precio-${producto.producto_id}`} className="text-xs text-gray-500">Precio Unit. ($)</label>
                  <input
                    id={`precio-${producto.producto_id}`}
                    type="number"
                    min={0}
                    step="0.01"
                    value={producto.precio_unitario}
                    onChange={(e) => cambiarPrecio(producto.producto_id, parseFloat(e.target.value))}
                    onFocus={e => {
                      if (e.target.value === "0" || e.target.value === "0.00") {
                        e.target.value = "";
                      }
                    }}
                    className="w-full border rounded px-2 py-1 appearance-none"
                    style={{ MozAppearance: 'textfield' }}
                  />
                  <style>{`
                    input[type=number]::-webkit-inner-spin-button,
                    input[type=number]::-webkit-outer-spin-button {
                      -webkit-appearance: none;
                      margin: 0;
                    }
                    input[type=number] {
                      -moz-appearance: textfield;
                    }
                  `}</style>
                </div>

                <div className="md:col-span-1 flex justify-end">
                  <button type="button" onClick={() => eliminarProducto(producto.producto_id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100" aria-label={`Eliminar ${producto.nombre}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default SelectorDeProductos;