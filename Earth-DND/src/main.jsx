import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // JS de Bootstrap (accordion, popover, etc.)
import "./index.css";
import App from "./App.jsx";

// boton para que se guarde en favoritos
//lugar donde publicar tu casa
//lugar para mostrar las cas publicadas
//reservar una casa
//buscador

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
