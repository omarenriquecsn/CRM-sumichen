import React from "react";
import { Layout } from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import { User, Phone, DollarSign } from "lucide-react";
import useVendedores from "../../hooks/useVendedores";
import { Meta, Vendedor } from "../../types"; // Asegúrate de que la interfaz Vendedor esté definida en tu types.ts
import Modal from "../../components/ui/Modal";
import MetasForm from "../../components/forms/metasForm";
import { usePostMetas } from "../../hooks/useMetas";
const Vendedores: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [vendedorSeleccionado, setVendedorSeleccionado] =
    React.useState<Vendedor | null>(null);
  const { data: vendedores, isLoading, error } = useVendedores();
  //   const navigate = useNavigate();

 // metas
 const {mutate: actualizarMetas} = usePostMetas();

  if (isLoading)
    return (
      <Layout title="Vendedores" subtitle="Cargando...">
        <div>Cargando vendedores...</div>
      </Layout>
    );
  if (error)
    return (
      <Layout title="Vendedores" subtitle="Error al cargar datos">
        <div>Error al cargar vendedores</div>
      </Layout>
    );

  const abrirModalMetas = (vendedor: Vendedor) => {
    setVendedorSeleccionado(vendedor);
    setModalOpen(true);
  };

  const handleActualizarMetas = (metas: Partial<Meta>) => {
    if (vendedorSeleccionado) {
      actualizarMetas({ vendedorId: vendedorSeleccionado.id, metas });
    }
  };

  return (
    <Layout title="Vendedores" subtitle="Lista de vendedores registrados">
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Nombre
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Teléfono
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Meta de Ventas
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Panel
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">
                    Metas
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vendedores?.map((vendedor: Vendedor) => (
                  <tr key={vendedor.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-blue-600" />
                        <span>
                          {vendedor.nombre} {vendedor.apellido}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Phone className="h-4 w-4" />
                        <span>{vendedor.telefono}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-900">
                          ${vendedor.meta_mensual_ventas.toFixed(2) ?? "0.00"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/vendedores/${vendedor.supabase_id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Ver Panel
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        className="text-blue-600 hover:underline font-medium"
                        onClick={() => abrirModalMetas(vendedor)}
                      >
                        Asignar Metas
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {vendedorSeleccionado && (
          <MetasForm
            vendedor={vendedorSeleccionado}
            onSubmit={(metas) => {
              handleActualizarMetas(metas);
              setModalOpen(false);
            }}
          />
        )}
      </Modal>
    </Layout>
    
  );
};

export default Vendedores;
