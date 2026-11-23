import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all environment variables from .env files in process.cwd()
  const env = loadEnv(mode, process.cwd(), "");

  // 1. Port numbers for server and proxy strictly managed via .env
  const PORT = Number(process.env.PORT || env.PORT || env.VITE_PORT || 5173);
  const PROXY_PORT = env.PROXY_PORT || env.VITE_PROXY_PORT;
  const PROXY_TARGET = env.PROXY_TARGET || env.VITE_PROXY_TARGET || (PROXY_PORT ? `http://localhost:${PROXY_PORT}` : "");

  // 3. Allowed hosts mapped with .env to prevent host blocking:
  // "Blocked request. This host ('domainname') is not allowed."
  // If ALLOWED_HOSTS is not provided or set to 'true' or '*', allow all hosts (true).
  // Otherwise, split comma-separated list of hostnames from .env.
  const rawAllowedHosts = env.ALLOWED_HOSTS || env.VITE_ALLOWED_HOSTS;
  const allowedHostsConfig: boolean | string[] = !rawAllowedHosts || rawAllowedHosts === "true" || rawAllowedHosts === "*"
    ? true
    : rawAllowedHosts.split(",").map((h) => h.trim()).filter(Boolean);

  const proxyConfig = PROXY_TARGET
    ? {
        "/api": {
          target: PROXY_TARGET,
          changeOrigin: true,
          secure: false,
        },
      }
    : undefined;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: PORT,
      host: true,
      allowedHosts: allowedHostsConfig,
      proxy: proxyConfig,
    },
    preview: {
      port: PORT,
      host: true,
      allowedHosts: allowedHostsConfig,
      proxy: proxyConfig,
    },
  };
});
