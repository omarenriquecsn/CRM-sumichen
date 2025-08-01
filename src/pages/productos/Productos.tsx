import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Layout } from "../../components/layout/Layout";

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
  const [data, setData] = useState<Array<Array<string | number>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ExportExcel()
      .then((excelData) => {
        setData(excelData as Array<Array<string | number>>);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al cargar el archivo Excel");
        }
        setLoading(false);
      });
  }, []);

 
  if (error) return <div className="text-red-500">{error}</div>;
  

  const encabezado = ['Numero', 'Producto', 'Presentacion', 'Precio Unitario'];

  return (
    <Layout
      title="Productos"
      subtitle="Lista de productos disponibles en el inventario."
    >
      {loading ? (
        <div>Cargando archivo Excel...</div>
      ) : data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr>
              {
              encabezado.map((cell, idx) => (
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
            {data.map((row, i) => (
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
                    {cell}
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
