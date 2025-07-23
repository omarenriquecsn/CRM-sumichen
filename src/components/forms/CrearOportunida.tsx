import { useState } from "react";
import { Oportunidad } from "../../types";
import { useSupabase } from "../../hooks/useSupabase";

type props = {
  onSubmit: (data: Partial<Oportunidad>) => void;
  id?: string;
  accion: string;
  etapa?: "inicial" | "calificado" | "propuesta" | "negociacion" | "cerrado" ;
};

const CrearOportunidad = ({ onSubmit, accion, etapa }: props) => {
  const supabase = useSupabase();
  const [formData, setFormData] = useState<Partial<Oportunidad>>({
    cliente_id: "",
    titulo: "",
    descripcion: "",
    valor: 0,
    probabilidad: 0,
    etapa: etapa || "inicial",
    fecha_creacion: new Date(),
  });

  const { data: clientes } = supabase.useClientes();
  const handledChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Título
      </label>
      <input
        type="text"
        name="titulo"
        placeholder="Título de la oportunidad"
        value={formData.titulo}
        onChange={handledChange}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
      />
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Descripción
      </label>
      <textarea
        name="descripcion"
        placeholder="Descripción de la oportunidad"
        value={formData.descripcion}
        onChange={handledChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 min-h-[48px]"
      />
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Valor
      </label>
      <input
        type="number"
        name="valor"
        placeholder="Valor de la oportunidad"
        value={formData.valor}
        onChange={handledChange}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
      />
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Probabilidad (%)
      </label>
      <input
        type="number"
        name="probabilidad"
        placeholder="Probabilidad de cierre"
        value={formData.probabilidad}
        onChange={handledChange}
        required
        min="0"
        max="100"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
      />

      <div>
        <label
          htmlFor="cliente"
          className="block text-sm font-medium text-gray-700"
        >
          Cliente
        </label>
        <select
          name="cliente_id"
          id="cliente"
          value={formData.cliente_id}
          onChange={handledChange}
          className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm bg-white"
        >
          <option value="">Seleccione un cliente</option>
          {clientes?.map((cliente) => (
            <option key={cliente.rif} value={cliente.id}>
              {cliente.nombre} {cliente.apellido} - {cliente.empresa}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 rounded-lg font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {accion}
        </button>
      </div>
    </form>
  );
};

export default CrearOportunidad;
