// DetalleInteraccionModal.tsx
import { useState } from "react";
import { Cliente } from "../../types";
import { useSupabase } from "../../hooks/useSupabase";
import { User } from "@supabase/supabase-js";

interface DetalleInteraccionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (detalle: string) => void;
  cliente: Cliente;
}
export const DetalleInteraccionModal = ({
  isOpen,
  onClose,
  cliente,
}: DetalleInteraccionModalProps) => {
  const supabase = useSupabase();

  const { mutate: cambiarNota } = supabase.useActualizarCliente();
  const [detalle, setDetalle] = useState("");

  const handledSumit = () => {
    cliente.notas = detalle;
    cambiarNota({
      clienteData: cliente,
      currentUser: { id: cliente.vendedor_id } as User,
    });
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-2">Detalles de la interacción</h2>
        <p className="mb-2 text-sm text-gray-600">
          Cliente: <b>{cliente.empresa}</b>
        </p>
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={4}
          placeholder="Ejemplo: Llamada realizada, se presentó propuesta, el cliente pidió tiempo para analizar..."
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handledSumit}
            disabled={!detalle.trim()}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default DetalleInteraccionModal;
