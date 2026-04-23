import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'

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
    plugins: [vue(), cesium()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'cesium': ['cesium']
          }
        }
      }
    }
  }
})
