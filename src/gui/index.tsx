import {createRoot} from "npm:react-dom";
import React from "npm:react";
import App from "./App.js";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}
