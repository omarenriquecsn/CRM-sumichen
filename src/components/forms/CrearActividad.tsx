import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { ICrearActividad } from "../../types";

type props = {
  onSubmit: (data: ICrearActividad) => void;
  id?: string;
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
    completado: false,
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
    <form className="space-y-6" action="">
      <div>
        <label
          htmlFor="tipo"
          className="block text-sm font-medium text-gray-700"
        >
          Tipo de Actividad
        </label>
        <input
          type="select"
          name="tipo"
          id="tipo"
          value={formData.tipo}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <option value="email">email</option>
        <option value="llamada">llamada</option>
        <option value="reunion">reunion</option>
        <option value="nota">nota</option>
        <option value="tarea">tarea</option>
      </div>

      <div>
        <label
          htmlFor="titulo"
          className="block text-sm font-medium text-gray-700"
        >
          Título
        </label>
        <input
          type="text"
          name="titulo"
          id="titulo"
          value={formData.titulo}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Descripción
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.descripcion}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
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
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="fecha"
          className="block text-sm font-medium text-gray-700"
        >
          Fecha de Vencimiento
        </label>
        <input
          type="date"
          name="fecha_vencimiento"
          id="fecha_vencimiento"
          value={formData.fecha_vencimiento?.toLocaleString()}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleSubmit}
      >
        Crear Actividad
      </button>
    </form>
  );
};

export default CrearActividad;
