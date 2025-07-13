import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { ICrearActividad } from "../../types";

type props = {
  onSubmit: (data: ICrearActividad) => void;
  id?: string;
  accion: string;
};

const CrearActividad = ({ id, onSubmit }: props) => {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState<ICrearActividad>({
    cliente_id: id || "",
    vendedor_id: currentUser?.id || "",
    tipo: "email",
    titulo: "",
    descripcion: "",
    fecha: new Date(),
    fecha_vencimiento: new Date(),
    completado: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <div className="flex flex-col w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            name="titulo"
            id="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
        </div>
        <div className="w-1/2 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Actividad
          </label>
          <select
            name="tipo"
            id="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          >
            <option value="email">email</option>
            <option value="llamada">llamada</option>
            <option value="reunion">reunion</option>
            <option value="nota">nota</option>
            <option value="tarea">tarea</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          placeholder="Descripcion"
          value={formData.descripcion ?? ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 min-h-[48px]"
        />
      </div>

      <div className="flex gap-3">
        <div className="w-1/2">
          <label
            htmlFor="fecha"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha
          </label>
          <input
            type="date"
            name="fecha"
            id="fecha"
            value={formData.fecha?.toLocaleString()}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
        </div>

        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Vencimiento
          </label>
          <input
            type="date"
            name="fecha_vencimiento"
            id="fecha_vencimiento"
            value={formData.fecha_vencimiento?.toLocaleString()}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 rounded-lg font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear Actividad
        </button>
      </div>
    </form>
  );
};

export default CrearActividad;
