import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { CartProvider } from "./contexts/CartContext";
import { ValueProvider } from "./contexts/ValueContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ValueProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ValueProvider>
  </React.StrictMode>
);
