import React, { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import { DndContext, closestCenter, DragEndEvent, useDroppable, DragOverlay } from "@dnd-kit/core";

import { SortableContext } from "@dnd-kit/sortable";

import type { Cliente } from "../../types";
type Etapa = typeof etapas[number];

type PipelineColumnProps = {
  etapa: Etapa;
  oportunidadesEtapa: Oportunidad[];
  cliente: (id: string) => Cliente | undefined;
  onAdd: () => void;
};

function PipelineColumn({ etapa, oportunidadesEtapa, cliente, onAdd }: PipelineColumnProps) {
  const { setNodeRef } = useDroppable({ id: etapa.id });
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className={`p-4 rounded-t-xl border-b ${getColorClasses(etapa.color)}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{etapa.titulo}</h3>
          <button
            onClick={onAdd}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm mt-1">
          ${calcularTotalEtapa(oportunidadesEtapa, etapa.id).toLocaleString()}
        </p>
      </div>
      <SortableContext items={oportunidadesEtapa.map((o) => o.id)} id={etapa.id}>
        <div ref={setNodeRef} className="p-4 min-h-[200px] md:min-h-[400px] max-h-screen overflow-auto">
          {oportunidadesEtapa.map((oportunidad: Oportunidad) => {
            const cli = cliente(oportunidad.cliente_id);
            if (!cli) return null;
            return (
              <OportunidadCard
                key={oportunidad.id}
                oportunidad={oportunidad}
                cliente={cli}
              />
            );
          })}
        </div>
      </SortableContext>
    </div>
  );
}

import { Plus } from "lucide-react";
import { useSupabase } from "../../hooks/useSupabase";
import Modal from "../../components/ui/Modal";
import CrearOportunidad from "../../components/forms/CrearOportunida";
// import { toast } from "react-toastify";
import { Oportunidad } from "../../types";
import { useAuth } from "../../context/useAuth";
import { etapas } from "../../constants/etapas";
import {
  getColorClasses,
  calcularTotalEtapa,
} from "../../utils/oportunidades";
import { useOportunidadAccion } from "../../hooks/useOportunidadAccion";
import OportunidadCard from "./OportunidadCard";

export const Pipeline: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [oportunidadesOptimista, setOportunidadesOptimista] = useState<Oportunidad[] | null>(null);
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
    if (!currentUser) return;

    data.vendedor_id = currentUser.id;
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

  const oportunidades = oportunidadesOptimista || [...(Oportunidades || [])];

  // onDragEnd handler
  const handleDragStart = (event: { active: { id: string | number } }) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) {
      setOportunidadesOptimista(null);
      return;
    }

    // Buscar la oportunidad arrastrada
    const oportunidad = (oportunidadesOptimista || Oportunidades || []).find((o) => o.id === String(active.id));
    if (!oportunidad) {
      setOportunidadesOptimista(null);
      return;
    }

    // Determinar la etapa destino
    let etapaDestino = oportunidad.etapa;
    let found = false;
    for (const etapa of etapas) {
      const idsEtapa = (oportunidadesOptimista || Oportunidades || [])
        .filter((o) => o.etapa === etapa.id)
        .map((o) => String(o.id));
      if (idsEtapa.includes(String(over.id))) {
        etapaDestino = etapa.id as typeof oportunidad.etapa;
        found = true;
        break;
      }
    }
    if (!found) {
      const etapaColumna = etapas.find((etapa) => etapa.id === over.id);
      if (etapaColumna) {
        etapaDestino = etapaColumna.id as typeof oportunidad.etapa;
      }
    }

    // Si cambió de etapa, actualiza la etapa y el estado optimista
    if (etapaDestino !== oportunidad.etapa) {
      // Estado optimista: mover la oportunidad en la UI
      setOportunidadesOptimista(
        (oportunidadesOptimista || Oportunidades || []).map((o) =>
          o.id === oportunidad.id ? { ...o, etapa: etapaDestino } : o
        )
      );
      await actualizarEtapaDrag(oportunidad.id, etapaDestino);
      // Limpiar el estado optimista después de un pequeño delay para permitir la animación
      setTimeout(() => setOportunidadesOptimista(null), 500);
    } else {
      setOportunidadesOptimista(null);
    }
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

        {/* Pipeline visual - dnd-kit */}
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-h-screen overflow-auto">
            {etapas.map((etapa) => {
              const oportunidadesEtapa = oportunidades.filter((o) => o.etapa === etapa.id);
              return (
                <PipelineColumn
                  key={etapa.id}
                  etapa={etapa}
                  oportunidadesEtapa={oportunidadesEtapa}
                  cliente={cliente}
                  onAdd={() => {
                    setModalOpen(true);
                    setEtapaSeleccionada(etapa.id);
                  }}
                />
              );
            })}
          </div>
          <DragOverlay>
            {activeId ? (() => {
              const oportunidad = oportunidades.find((o) => o.id === activeId);
              if (!oportunidad) return null;
              const cli = cliente(oportunidad.cliente_id);
              if (!cli) return null;
              return <OportunidadCard oportunidad={oportunidad} cliente={cli} />;
            })() : null}
          </DragOverlay>
        </DndContext>

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
