// ConfirmarAccionToast.tsx
import { Dispatch, SetStateAction } from "react";
import { ConfirmToast } from "react-confirm-toast";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
  texto?: string;
  posicion?: "bottom-right" | "top-left" | "top-right" | "bottom-left";
  tema?: "light" | "dark" | "lilac" | "snow";
  modoModal?: boolean;
}

export const ConfirmarAccionToast = ({
  visible,
  setVisible,
  onConfirm,
  texto = "¿Estás seguro de que deseas realizar esta acción?",
  posicion = "bottom-right",
  tema = "dark",
  modoModal = false,
}: Props) => {
  return (
    <ConfirmToast
      customFunction={onConfirm}
      showConfirmToast={visible}
      setShowConfirmToast={setVisible}
      toastText={texto}
      buttonYesText="Sí"
      buttonNoText="No"
      position={posicion}
      theme={tema}
      asModal={modoModal}
    />
  );
};
