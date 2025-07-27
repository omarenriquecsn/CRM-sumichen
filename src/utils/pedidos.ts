  export const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "borrador":
        return "bg-gray-100 text-gray-800";
      case "enviado":
        return "bg-blue-100 text-blue-800";
      case "aprobado":
        return "bg-green-100 text-green-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      case "procesando":
        return "bg-yellow-100 text-yellow-800";
      case "completado":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };