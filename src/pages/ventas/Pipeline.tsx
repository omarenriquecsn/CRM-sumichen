import React from "react";
import { Layout } from "../../components/layout/Layout";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DollarSign, User, Calendar, Plus } from "lucide-react";

export const Pipeline: React.FC = () => {
  const etapas = [
    { id: "inicial", titulo: "Inicial", color: "gray" },
    { id: "calificado", titulo: "Calificado", color: "blue" },
    { id: "propuesta", titulo: "Propuesta", color: "yellow" },
    { id: "negociacion", titulo: "Negociación", color: "orange" },
    { id: "cerrado", titulo: "Cerrado", color: "green" },
  ];

  const oportunidades = {
    inicial: [
      {
        id: "1",
        cliente: "TechStart Inc.",
        contacto: "Luis Martín",
        valor: 15000,
        fechaCreacion: new Date("2024-01-10"),
        probabilidad: 20,
      },
      {
        id: "2",
        cliente: "Digital Solutions",
        contacto: "Carmen Ruiz",
        valor: 8500,
        fechaCreacion: new Date("2024-01-12"),
        probabilidad: 15,
      },
    ],
    calificado: [
      {
        id: "3",
        cliente: "Innovación Corp",
        contacto: "Roberto Silva",
        valor: 32000,
        fechaCreacion: new Date("2024-01-05"),
        probabilidad: 40,
      },
    ],
    propuesta: [
      {
        id: "4",
        cliente: "TechCorp S.A.",
        contacto: "Ana García",
        valor: 45000,
        fechaCreacion: new Date("2023-12-20"),
        probabilidad: 70,
      },
      {
        id: "5",
        cliente: "Sistemas Avanzados",
        contacto: "Miguel Torres",
        valor: 28000,
        fechaCreacion: new Date("2024-01-08"),
        probabilidad: 60,
      },
    ],
    negociacion: [
      {
        id: "6",
        cliente: "Soluciones Empresariales",
        contacto: "María Rodríguez",
        valor: 78000,
        fechaCreacion: new Date("2023-12-15"),
        probabilidad: 85,
      },
    ],
    cerrado: [
      {
        id: "7",
        cliente: "Global Tech",
        contacto: "Fernando López",
        valor: 52000,
        fechaCreacion: new Date("2023-11-30"),
        probabilidad: 100,
      },
    ],
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "gray":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "orange":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProbabilityColor = (probabilidad: number) => {
    if (probabilidad >= 80) return "text-green-600";
    if (probabilidad >= 60) return "text-yellow-600";
    if (probabilidad >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const calcularTotalEtapa = (etapaId: string) => {
    return (
      oportunidades[etapaId as keyof typeof oportunidades]?.reduce(
        (sum, oportunidad) => sum + oportunidad.valor,
        0
      ) || 0
    );
  };

  const onDragEnd = (result: any) => {
    // Aquí implementarías la lógica para mover las oportunidades entre etapas
    console.log("Drag ended:", result);
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
                  {oportunidades[etapa.id as keyof typeof oportunidades]
                    ?.length || 0}
                </span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                ${calcularTotalEtapa(etapa.id).toLocaleString()}
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
                    <button className="p-1 hover:bg-white hover:bg-opacity-20 rounded">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm mt-1">
                    ${calcularTotalEtapa(etapa.id).toLocaleString()}
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
                      {oportunidades[
                        etapa.id as keyof typeof oportunidades
                      ]?.map((oportunidad, index) => (
                        <Draggable
                          key={oportunidad.id}
                          draggableId={oportunidad.id}
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
                                  <h4 className="font-medium text-gray-900 text-sm">
                                    {oportunidad.cliente}
                                  </h4>
                                  <div className="flex items-center space-x-1 mt-1">
                                    <User className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">
                                      {oportunidad.contacto}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-1">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span className="font-semibold text-gray-900 text-sm">
                                      ${oportunidad.valor.toLocaleString()}
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

                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {oportunidad.fechaCreacion.toLocaleDateString()}
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
                {Object.values(oportunidades).flat().length}
              </p>
              <p className="text-sm text-gray-600">Oportunidades Totales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                $
                {Object.values(oportunidades)
                  .flat()
                  .reduce((sum, op) => sum + op.valor, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Valor Total Pipeline</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                $
                {Object.values(oportunidades)
                  .flat()
                  .reduce(
                    (sum, op) => sum + (op.valor * op.probabilidad) / 100,
                    0
                  )
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Valor Ponderado</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(
                  Object.values(oportunidades)
                    .flat()
                    .reduce((sum, op) => sum + op.probabilidad, 0) /
                    Object.values(oportunidades).flat().length
                )}
                %
              </p>
              <p className="text-sm text-gray-600">Probabilidad Promedio</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
