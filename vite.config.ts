import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { createVitePlugins } from './build/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: createVitePlugins(),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/themes/theme.scss" as *;`,
      },
    },
  },
  server: {
    open: true,
    allowedHosts: [
      'devserver-dev--drag-vue-form.netlify.app', // 允许 Netlify 开发域名
    ],
  },
})
