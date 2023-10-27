import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  return {
    plugins: [react()],
    server: (mode === 'development') ? {
      proxy: {
        '/api': {
          target: process.env.VITE_API_BASE_URL,
          changeOrigin: true,
        }
      }
    } : {},
    base: (mode === 'development') ? '' : `${process.env.VITE_API_PREFIX}/static`
  }
})
