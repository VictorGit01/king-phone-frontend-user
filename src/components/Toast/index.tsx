import { useEffect, useState } from "react";

export interface ToastProps {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export const Toast = ({
  show,
  message,
  type,
  duration = 4000,
  onClose,
}: ToastProps) => {
  const desktopPosition = "top-right" as const;

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767.98px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 767.98px)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // Safari antigo no passa event igual
      const matches = "matches" in e ? e.matches : mql.matches;
      setIsMobile(matches);
    };

    // inicial
    setIsMobile(mql.matches);

    if ("addEventListener" in mql) {
      mql.addEventListener("change", handleChange as (e: MediaQueryListEvent) => void);
      return () => mql.removeEventListener("change", handleChange as (e: MediaQueryListEvent) => void);
    }

    // @ts-expect-error - fallback para browsers antigos
    mql.addListener(handleChange);
    // @ts-expect-error - fallback para browsers antigos
    return () => mql.removeListener(handleChange);
  }, []);
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [show, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          borderColor: "border-green-500",
        };
      case "error":
        return {
          borderColor: "border-red-500",
        };
      case "warning":
        return {
          borderColor: "border-yellow-500",
        };
      case "info":
      default:
        return {
          borderColor: "border-blue-500",
        };
    }
  };


  const typeStyles = getTypeStyles();

  const desktopPositionClass =
    desktopPosition === "top-right"
      ? "top-4 right-4"
      : desktopPosition === "top-left"
        ? "top-4 left-4"
        : desktopPosition === "bottom-right"
          ? "bottom-4 right-4"
          : desktopPosition === "bottom-left"
            ? "bottom-4 left-4"
            : desktopPosition === "top-center"
              ? "top-4 left-1/2 -translate-x-1/2"
              : "bottom-4 left-1/2 -translate-x-1/2";

  const desktopTransformClass =
    desktopPosition === "top-right" || desktopPosition === "bottom-right"
      ? show
        ? "translate-x-0"
        : "translate-x-full"
      : desktopPosition === "top-left" || desktopPosition === "bottom-left"
        ? show
          ? "translate-x-0"
          : "-translate-x-full"
        : desktopPosition === "top-center"
          ? show
            ? "translate-y-0"
            : "-translate-y-full"
          : show
            ? "translate-y-0"
            : "translate-y-full";

  // Mantm montado para animar entrada/sada.
  const containerVisibilityClass = show
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";

  const content = (
    <>
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white text-center whitespace-pre-line">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Fechar notificação"
          type="button"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </>
  );

  const mobileClass =
    `fixed z-[9999] transform transition duration-500 ease-out ${containerVisibilityClass} ` +
    `${show ? "translate-y-0" : "translate-y-full"} bottom-4 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[560px] ` +
    `bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 ${typeStyles.borderColor} p-4`;

  const desktopClass =
    `fixed z-[9999] transform transition duration-500 ease-out ${containerVisibilityClass} ` +
    `${desktopPositionClass} ${desktopTransformClass} min-w-[300px] max-w-[400px] ` +
    `bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 ${typeStyles.borderColor} p-4`;

  return <div className={isMobile ? mobileClass : desktopClass}>{content}</div>;
};
