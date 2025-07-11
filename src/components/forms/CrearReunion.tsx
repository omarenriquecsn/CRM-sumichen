import { useState } from "react";
import { ICrearReunion } from "../../types";
import { useAuth } from "../../context/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type CrearReunionProps = {
  cliente_id: string;
  onSubmit: (data: ICrearReunion) => void;
};

const CrearReunion = ({ cliente_id, onSubmit }: CrearReunionProps) => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<ICrearReunion>({
    cliente_id: cliente_id,
    vendedor_id: currentUser?.id || "",
    titulo: "",
    descripcion: "",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    ubicacion: "",
    estado: "programada",
    recordatorio: true,
  });
  if (!currentUser) {
    toast.error("Error usuario no logueado");
    navigate("/login");
    return;
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <form onClick={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titulo
        </label>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.titulo}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
        />
      </div>
    </form>
  );
};

export default CrearReunion;
