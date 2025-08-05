import React from "react";
import * as XLSX from "xlsx";
import { Layout } from "../../components/layout/Layout";
import { useQuery } from "@tanstack/react-query";

const EXCEL_URL =
  "https://syaiyhcnqhhzdhmifynh.supabase.co/storage/v1/object/public/inventario//inventario.xlsx";

export async function ExportExcel() {
  // Agrega parámetro único para evitar caché
  const urlConCacheBusting = `${EXCEL_URL}?t=${Date.now()}`;
  const res = await fetch(urlConCacheBusting, { cache: "reload" });
  const blob = await res.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  return data;
}

export const ExcelViewer: React.FC = () => {
  const encabezado = ["CODIGO", "DESCRIPCION", "GLOBALCA", "WMS", "TOTAL"];
  const {
    data: excelData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["excelData"],
    queryFn: ExportExcel,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
  });

  if (error) return <div className="text-red-500">{String(error)}</div>;

  return (
    <Layout
      title="Productos"
      subtitle="Lista de productos disponibles en el inventario."
    >
      {isLoading ? (
        <div>Cargando archivo Excel...</div>
      ) : excelData && excelData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr>
                {encabezado.map((cell, idx) => (
                  <th
                    key={idx}
                    className={
                      idx === 0
                        ? "px-4 py-2 border-b bg-gray-100 text-left text-sm font-semibold text-gray-700 max-w-xs truncate"
                        : "px-4 py-2 border-b bg-gray-100 text-left text-sm font-semibold text-gray-700"
                    }
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(excelData as Array<Array<string | number>>).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={
                        j === 0
                          ? "px-4 py-2 border-b text-sm text-gray-800 max-w-1 truncate"
                          : "px-4 py-2 border-b text-sm text-gray-800"
                      }
                    >
                      {typeof cell === "number"
                        ? cell.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No se encontraron productos en el inventario.</div>
      )}
    </Layout>
  );
};
