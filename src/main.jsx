import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import WeeklyRanking from "./components/landing/WeeklyRanking";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WeeklyRanking />
  </StrictMode>
);
