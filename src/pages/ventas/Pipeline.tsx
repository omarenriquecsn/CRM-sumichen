import React, { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { DollarSign, User, Calendar, Plus } from "lucide-react";
import { useSupabase } from "../../hooks/useSupabase";
import Modal from "../../components/ui/Modal";
import CrearOportunidad from "../../components/forms/CrearOportunida";
// import { toast } from "react-toastify";
import { Oportunidad } from "../../types";
import { useAuth } from "../../context/useAuth";
import dayjs from "dayjs";
import { etapas } from "../../constants/etapas";
import {
  getColorClasses,
  calcularTotalEtapa,
  getProbabilityColor,
} from "../../utils/oportunidades";
import { useOportunidadAccion } from "../../hooks/useOportunidadAccion";

export const Pipeline: React.FC = () => {
  const { currentUser } = useAuth();
  const supabase = useSupabase();

  const { submitOportunidad, actualizarEtapaDrag } = useOportunidadAccion();

  const { data: Oportunidades } = supabase.useOportunidades();
  const { data: clientes } = supabase.useClientes();

  const { isPending: pendingOportunidad } = supabase.useCrearOportunidades();

  const [isModalOpen, setModalOpen] = useState(false);
  const [etapaSeleccionada, setEtapaSeleccionada] = useState<string | null>(
    null
  );
  const handleOportunidadSubmit = async (data: Partial<Oportunidad>) => {
    await submitOportunidad(data, () => {
      setModalOpen(false);
    });
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const cliente = (cliente_id: string) => {
    const cliente = clientes?.find((c) => c.id === cliente_id);
    return cliente;
  };

  const oportunidades = [...(Oportunidades || [])];

  const onDragEnd = (result: DropResult) => {
    if (!currentUser) return;
    actualizarEtapaDrag(result, oportunidades);
  };

  return (
    <Layout
      title="Pipeline de Ventas"
      subtitle="Gestiona tus oportunidades de venta por etapas"
    >
      <div className="space-y-6">
        {/* Resumen del pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {etapas.map((etapa) => (
            <div
              key={etapa.id}
              className="bg-white rounded-lg p-4 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{etapa.titulo}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClasses(
                    etapa.color
                  )}`}
                >
                  {
                    oportunidades.filter(
                      (oportunidad) => oportunidad.etapa === etapa.id
                    ).length
                  }
                </span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                ${calcularTotalEtapa(oportunidades, etapa.id).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Pipeline visual */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {etapas.map((etapa) => (
              <div
                key={etapa.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div
                  className={`p-4 rounded-t-xl border-b ${getColorClasses(
                    etapa.color
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{etapa.titulo}</h3>
                    <button
                      onClick={() => (
                        setModalOpen(true), setEtapaSeleccionada(etapa.id)
                      )}
                      className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm mt-1">
                    $
                    {calcularTotalEtapa(
                      oportunidades,
                      etapa.id
                    ).toLocaleString()}
                  </p>
                </div>

                <Droppable droppableId={etapa.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 min-h-[400px] ${
                        snapshot.isDraggingOver ? "bg-blue-50" : ""
                      }`}
                    >
                      {oportunidades
                        .filter((o) => o.etapa === etapa.id)
                        .map((oportunidad, index) => (
                          <Draggable
                            key={oportunidad.id}
                            draggableId={String(oportunidad.id)}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                                  snapshot.isDragging ? "shadow-lg" : ""
                                }`}
                              >
                                <div className="space-y-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900 text-sm text-center">
                                      {cliente(oportunidad.cliente_id)?.nombre}{" "}
                                      {
                                        cliente(oportunidad.cliente_id)
                                          ?.apellido
                                      }
                                    </h4>
                                    <div className="flex items-center justify-center space-x-1 mt-1">
                                      <User className="h-3 w-3 text-gray-400" />
                                      <span className="text-xs text-gray-500">
                                        {
                                          cliente(oportunidad.cliente_id)
                                            ?.telefono
                                        }
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-center gap-2">
                                    <div className="flex items-center space-x-1">
                                      <DollarSign className="h-4 w-4 text-green-600" />
                                      <span className="font-semibold text-gray-900 text-sm">
                                        $
                                        {Number(
                                          oportunidad.valor
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                    <span
                                      className={`text-xs font-medium ${getProbabilityColor(
                                        oportunidad.probabilidad
                                      )}`}
                                    >
                                      {oportunidad.probabilidad}%
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-center space-x-1">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                      {dayjs(oportunidad.fecha_creacion).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </span>
                                  </div>

                                  {/* Barra de probabilidad */}
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className={`h-1.5 rounded-full ${
                                        oportunidad.probabilidad >= 80
                                          ? "bg-green-500"
                                          : oportunidad.probabilidad >= 60
                                          ? "bg-yellow-500"
                                          : oportunidad.probabilidad >= 40
                                          ? "bg-orange-500"
                                          : "bg-red-500"
                                      }`}
                                      style={{
                                        width: `${oportunidad.probabilidad}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {/* Estadísticas del pipeline */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estadísticas del Pipeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {oportunidades.length}
              </p>
              <p className="text-sm text-gray-600">Oportunidades Totales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                $
                {Object.values(oportunidades || [])
                  .flat()
                  .reduce((sum, op) => sum + Number(op?.valor || 0), 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Valor Total Pipeline</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                $
                {Object.values(oportunidades || [])
                  .flat()
                  .reduce(
                    (sum, op) =>
                      sum +
                      (Number(op?.valor || 0) * (op?.probabilidad || 0)) / 100,
                    0
                  )
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Valor Ponderado</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(
                  Object.values(oportunidades || [])
                    .flat()
                    .reduce((sum, op) => sum + (op?.probabilidad || 0), 0) /
                    Object.values(oportunidades).flat().length || 0
                )}
                %
              </p>
              <p className="text-sm text-gray-600">Probabilidad Promedio</p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Crear Oportunidad"
        isOpen={isModalOpen}
        onClose={handleModalClose}
      >
        <CrearOportunidad
          onSubmit={handleOportunidadSubmit}
          accion={!pendingOportunidad ? "Crear" : "Actualizar"}
          etapa={
            etapaSeleccionada as
              | "inicial"
              | "calificado"
              | "propuesta"
              | "negociacion"
              | "cerrado"
          }
        />
      </Modal>
    </Layout>
  );
};
