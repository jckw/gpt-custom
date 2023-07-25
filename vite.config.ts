import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { crx } from "@crxjs/vite-plugin"
import manifest from "./manifest.json"

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  worker: {
    plugins: [react()],
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
