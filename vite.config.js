import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("C:/WINDOWS/system32/localhost+2-key.pem"),
      cert: fs.readFileSync("C:/WINDOWS/system32/localhost+2.pem"),
    },
    host: "localhost",
    port: 5173,
  },
});
