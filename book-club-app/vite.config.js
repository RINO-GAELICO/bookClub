import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
          '@src': '/src',  // This will treat `/src` as an alias to `src/`
          '@components': '/src/components',  // Alias for the components folder
          '@css': '/src/css'  // Alias for the css folder
        },
    },
});
