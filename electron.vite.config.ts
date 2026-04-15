import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

const projectRoot = resolve(__dirname)

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    server: {
      fs: {
        allow: [projectRoot]
      }
    },
    plugins: [vue()]
  }
})
