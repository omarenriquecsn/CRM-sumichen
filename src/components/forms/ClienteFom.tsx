import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ClienteFormData } from "../../types";

interface Props {
  onSubmit: (data: ClienteFormData) => void;
  initialData?: Partial<ClienteFormData>; // Nuevo: datos iniciales para edición
  accion: string;
}


const schema = yup.object().shape({
  nombre: yup
    .string()
    .required("El nombre es obligatorio")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "El nombre solo puede contener letras y espacios"),
  apellido: yup
    .string()
    .required("El apellido es obligatorio")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "El apellido solo puede contener letras y espacios"),
  email: yup.string().email("Email inválido").required("El email es obligatorio"),
  telefono: yup
    .string()
    .required("El teléfono es obligatorio")
    .matches(/^[0-9+\-()\s]+$/, "Teléfono inválido"),
  empresa: yup.string().required("La Empresa es obligatoria"),
  estado: yup.string().required().default("prospecto"),
  etapa_venta: yup.string().required().default("inicial"),
  rif: yup
    .string()
    .required("El RIF es obligatorio")
    .matches(/^[JGVE][0-9]+$/, "El RIF debe comenzar con J, G, V o E seguido de números"),
  fecha_creacion: yup.date().required(),
  notas: yup.string().default(""),
  direccion: yup.string().default(""),
  ciudad: yup.string().default(""),
});

const ClienteForm: React.FC<Props> = ({ onSubmit, initialData, accion }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ClienteFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      apellido: initialData?.apellido || "",
      email: initialData?.email || "",
      telefono: initialData?.telefono || "",
      empresa: initialData?.empresa || "",
      estado: initialData?.estado || "prospecto",
      etapa_venta: initialData?.etapa_venta || "inicial",
      rif: initialData?.rif || "",
      fecha_creacion: initialData?.fecha_creacion
        ? new Date(initialData.fecha_creacion)
        : new Date(),
      notas: initialData?.notas || "",
      direccion: initialData?.direccion || "",
      ciudad: initialData?.ciudad || "",
    },
  });

  // Si el usuario edita, mantener la fecha de creación intacta
  React.useEffect(() => {
    if (initialData?.fecha_creacion) {
      setValue(
        "fecha_creacion",
        new Date(initialData.fecha_creacion)
      );
    }
  }, [initialData?.fecha_creacion, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              {...register("nombre")}
              placeholder="Nombre"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${errors.nombre ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              {...register("apellido")}
              placeholder="Apellido"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${errors.apellido ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.apellido && (
              <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              {...register("telefono")}
              placeholder="Teléfono"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${errors.telefono ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.telefono && (
              <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Empresa
            </label>
            <input
              type="text"
              {...register("empresa")}
              placeholder="Empresa"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${errors.empresa ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.empresa && (
              <p className="text-red-500 text-xs mt-1">{errors.empresa.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              {...register("estado")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${errors.estado ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="prospecto">Prospecto</option>
              <option value="activo">Cliente</option>
              <option value="inactivo">Inactivo</option>
            </select>
            {errors.estado && (
              <p className="text-red-500 text-xs mt-1">{errors.estado.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etapa de Venta
            </label>
            <select
              {...register("etapa_venta")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${errors.etapa_venta ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="inicial">Inicial</option>
              <option value="calificado">Calificado</option>
              <option value="propuesta">Propuesta</option>
              <option value="negociacion">Negociación</option>
              <option value="cerrado">Cerrado</option>
             
            </select>
            {errors.etapa_venta && (
              <p className="text-red-500 text-xs mt-1">{errors.etapa_venta.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rif de la Empresa
            </label>
            <input
              type="text"
              {...register("rif")}
              placeholder="Rif"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${errors.rif ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.rif && (
              <p className="text-red-500 text-xs mt-1">{errors.rif.message}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Creación
              </label>
              <input
                type="date"
                {...register("fecha_creacion")}
                value={
                  initialData?.fecha_creacion
                    ? new Date(initialData.fecha_creacion).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                disabled
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${errors.fecha_creacion ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.fecha_creacion && (
                <p className="text-red-500 text-xs mt-1">{errors.fecha_creacion.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              {...register("notas")}
              placeholder="Notas"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 min-h-[48px] ${errors.notas ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.notas && (
              <p className="text-red-500 text-xs mt-1">{errors.notas.message}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            {...register("direccion")}
            placeholder="Dirección"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${errors.direccion ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.direccion && (
            <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad
          </label>
          <input
            type="text"
            {...register("ciudad")}
            placeholder="Ciudad"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 ${errors.ciudad ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.ciudad && (
            <p className="text-red-500 text-xs mt-1">{errors.ciudad.message}</p>
          )}
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
