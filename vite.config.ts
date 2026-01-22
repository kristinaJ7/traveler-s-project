import { defineConfig } from "vite";

export default defineConfig({
   publicDir: 'public',  // копирует public/ в dist/public/
  plugins: [],
  css: {
    preprocessorOptions: {
      scss: {
       // api: "modern-compiler",
   
        loadPaths: ["./src/scss"],
      },
    },
  },
  build: {
    outDir: "dist",
    minify: true,
    sourcemap: true,
  },
  server: {
    port: 5173,
  },

   base: '/traveler-s-project/', 
});
