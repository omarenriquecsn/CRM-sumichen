import { Oportunidad } from "../types";


export const getColorClasses = (color: string): string => {
  const map = {
    gray: "bg-gray-100 text-gray-800 border-gray-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    green: "bg-green-100 text-green-800 border-green-200",
  };

  return map[color as keyof typeof map] || map.gray;
};

export const getProbabilityColor = (prob: number): string => {
  if (prob >= 80) return "text-green-600";
  if (prob >= 60) return "text-yellow-600";
  if (prob >= 40) return "text-orange-600";
  return "text-red-600";
};

export const calcularTotalEtapa = (oportunidades: Oportunidad[], etapaId: string): number =>
  oportunidades.filter((o) => o.etapa === etapaId).reduce((acc, o) => acc + Number(o.valor), 0);