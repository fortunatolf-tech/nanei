import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Nanei",
        short_name: "Nanei",
        description:
          "Rastreamento do bebê, previsão de sono e colaboração familiar",
        lang: "pt-BR",
        display: "standalone",
        background_color: "#1C1B1F",
        theme_color: "#1C1B1F",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
  },
});
