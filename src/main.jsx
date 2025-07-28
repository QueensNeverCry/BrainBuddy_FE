import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LandingIntro from "./components/landing/LandingIntro";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LandingIntro />
  </StrictMode>
);
