import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    target: "es2022"
  },
  plugins: [],
})
