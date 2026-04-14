import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  // 从 VITE_API_BASE_URL 中提取目标地址
  // 例如: http://10.10.41.170:40000/api -> http://10.10.41.170:40000
  const apiBaseUrl = env.VITE_API_BASE_URL || ''
  const proxyTarget = apiBaseUrl.replace(/\/api$/, '')

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      // 确保 axios 单例，让 @zcui/system 使用项目中的 axios
      dedupe: ['axios']
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    server: {
      port: 5188,
      open: true,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Vue 生态
            vue: ['vue', 'vue-router', 'pinia'],
            // UI 组件库
            arco: ['@arco-design/web-vue'],
            // 图表库
            g2: ['@antv/g2']
          }
        }
      }
    }
  }
})
