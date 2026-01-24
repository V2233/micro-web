import vue from '@vitejs/plugin-vue';
import crypto from 'crypto';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  let env = loadEnv(mode, process.cwd());
  return {
    build: {
      outDir: '../public/static',
      chunkSizeWarningLimit: 1024,
      // rollupOptions: {
      //   output: {
      //     manualChunks: {
      //       element: ['element-plus'],
      //       echarts: ['echarts'],
      //       moment: ['moment'],
      //       lodash: ['lodash-es','lodash'],
      //       liquidfill: ['echarts-liquidfill'],
      //       ace: ['ace-builds'],
      //       vuerouter: ['vue-router'],
      //       axios: ['axios'],
      //       jspdf: ['jspdf'],
      //       xterm: ['@xterm/xterm'],
      //       highlight: ['highlight.js'],
      //       html2canvas: ['html2canvas'],
      //       emoji: ['emoji-mart-vue-fast'],
      //       crypto: ['crypto-js']
      //     },
      //   }
      // }
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        localEnabled: command === 'serve', //保证开发阶段可以使用mock接口
      }),
      visualizer({
        open: true,
        gzipSize: true, // 分析图生成的文件名
        brotliSize: true, // 收集 brotli 大小并将其显示
        filename: 'stats.html', // 分析图生成的文件名
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/style/variable.scss";',
        },
      },
    },
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/,'')
        },
      },
    },
  };
});

function generateShortHash(input: string) {
  // 使用一个哈希函数（如 SHA-256）生成较长的哈希
  const hash = crypto.createHash('sha256').update(input).digest('hex');

  // 取哈希值的前8位作为短哈希
  return hash.slice(0, 8);
}
