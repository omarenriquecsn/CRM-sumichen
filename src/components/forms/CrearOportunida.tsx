import { useState } from "react";
import { Oportunidad } from "../../types";
import { useSupabase } from "../../hooks/useSupabase";

type props = {
  onSubmit: (data: Partial<Oportunidad>) => void;
  id?: string;
  accion: string;
  etapa?: "inicial" | "calificado" | "propuesta" | "negociacion" | "cerrado";
};

const CrearOportunidad = ({ onSubmit, accion, etapa }: props) => {
  const supabase = useSupabase();

  const valorProbabilidad = (etapa: string | undefined) => {
    switch (etapa) {
      case "inicial":
        return 10;
      case "calificado":
        return 30;
      case "propuesta":
        return 50;
      case "negociacion":
        return 70;
      case "cerrado":
        return 100;
      default:
        return 0;
    }
  };

  const [formData, setFormData] = useState<Partial<Oportunidad>>({
    cliente_id: "",
    titulo: "Oportunidad",
    descripcion: "",
    valor: 0,
    probabilidad: valorProbabilidad(etapa),
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;
    const isTextarea = target.tagName === "TEXTAREA";

    if (e.key === "Enter" && !isTextarea) {
      e.preventDefault(); // bloquea Enter solo fuera del textarea
    }
  };


  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
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
              {cliente.empresa}
            </option>
          ))}
        </select>
      </div>

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
        Venta Estimada
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
      {/* <label className="block text-sm font-medium text-gray-700 mb-1">
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
      /> */}

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
