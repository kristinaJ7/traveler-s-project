import { defineConfig } from "vite";

export default defineConfig({
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
