import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(() => {
  const env = process.env.NODE_ENV
  console.log(process.env.VITE_API_BASE_URL)
  return {
    plugins: [react()],
    server: (env === 'development') ? {
      proxy: {
        '/api': {
          target: process.env.VITE_API_BASE_URL,
          changeOrigin: true,
        }
      }
    } : {},
    base: (env === 'development') ? '' : `${process.env.VITE_API_PREFIX}/static`
  }
})
