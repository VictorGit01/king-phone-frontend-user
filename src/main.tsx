import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { CartProvider } from "./contexts/CartContext";
import { ValueProvider } from "./contexts/ValueContext";
import { ToastProvider } from "./contexts/ToastContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ValueProvider>
      <ToastProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ToastProvider>
    </ValueProvider>
  </React.StrictMode>
);
