import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import generouted from "@generouted/react-router/plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), generouted()],
});
