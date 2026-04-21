import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Rola para o topo em toda mudano de rota.
 *
 * Obs.: preserva o comportamento do browser quando houver hash (#ancora).
 */
export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) return;

    // Usa duas tentativas para cobrir casos onde a po ainda est renderizando.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [pathname, search, hash]);

  return null;
};
