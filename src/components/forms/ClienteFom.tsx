import React, { useState } from "react";
import { ClienteFormData } from "../../types";

interface Props {
  onSubmit: (data: ClienteFormData) => void;
  initialData?: Partial<ClienteFormData>; // Nuevo: datos iniciales para edición
  accion: string;
}

const ClienteForm: React.FC<Props> = ({ onSubmit, initialData, accion }) => {
  const [form, setForm] = useState<ClienteFormData>({
    nombre: initialData?.nombre || "",
    apellido: initialData?.apellido || "",
    email: initialData?.email || "",
    telefono: initialData?.telefono || "",
    empresa: initialData?.empresa || "",
    cargo: initialData?.cargo || "",
    estado: initialData?.estado || "prospecto",
    etapa_venta: initialData?.etapa_venta || "inicial",
    valor_potencial: initialData?.valor_potencial || 0,
    fecha_creacion: initialData?.fecha_creacion
      ? new Date(initialData.fecha_creacion)
      : new Date(),
    ultima_actividad: initialData?.ultima_actividad
      ? new Date(initialData.ultima_actividad)
      : new Date(),
    notas: initialData?.notas || "",
    direccion: initialData?.direccion || "",
    ciudad: initialData?.ciudad || "",
    codigo_postal: initialData?.codigo_postal || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "valor_potencial" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa
            </label>
            <input
              type="text"
              name="empresa"
              placeholder="Empresa"
              value={form.empresa ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo
            </label>
            <input
              type="text"
              name="cargo"
              placeholder="Cargo"
              value={form.cargo ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            >
              <option value="prospecto">Prospecto</option>
              <option value="cliente">Cliente</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etapa de Venta
            </label>
            <select
              name="etapaVenta"
              value={form.etapa_venta}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            >
              <option value="inicial">Inicial</option>
              <option value="calificado">Calificado</option>
              <option value="propuesta">Propuesta</option>
              <option value="negociacion">Negociación</option>
              <option value="cerrado">Cerrado</option>
              <option value="perdido">Perdido</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Potencial
            </label>
            <input
              type="number"
              name="valor_potencial"
              placeholder="Valor Potencial"
              value={form.valor_potencial}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Creación
              </label>
              <input
                type="date"
                name="fechaCreacion"
                value={form.fecha_creacion.toISOString().split("T")[0]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Última Actividad
              </label>
              <input
                type="date"
                name="ultimaActividad"
                value={form.ultima_actividad.toISOString().split("T")[0]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              name="notas"
              placeholder="Notas"
              value={form.notas ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 min-h-[48px]"
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={form.direccion ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                name="ciudad"
                placeholder="Ciudad"
                value={form.ciudad ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal
              </label>
              <input
                type="text"
                name="codigoPostal"
                placeholder="Código Postal"
                value={form.codigo_postal ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>
        </div>
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

export default ClienteForm;
