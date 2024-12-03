import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

// 定义一个函数 `r`，用于解析相对路径
export const r = (...args: string[]) => resolve(dirname(fileURLToPath(import.meta.url)), ...args)

export default defineConfig({
  base: './',
  root: r('src'),
  resolve: {
    alias: {
      '~/': `${r('src')}/`, // 设置别名 `~/` 为 `src/` 目录
    },
  },

  // 设置scss的api类型为modern-compiler https://blog.csdn.net/CssHero/article/details/142686148
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },

  plugins: [
    vue(),

    AutoImport({
      dts: r('./src/auto-imports.d.ts'), // 声明文件生成位置和文件名称
      imports: ['vue'],
    }),

    UnoCSS(),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'jetv-ui',
      fileName: format => `jetv-ui.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      input: r('src/index.ts'),
      output: {
        globals: {
          vue: 'Vue',
        },
        assetFileNames: 'jetv-ui.[ext]',
      },
    },
    minify: 'terser',
    outDir: r('dist'),
    sourcemap: false, // 使用 Terser 进行代码压缩
    terserOptions: {
      mangle: true, // 是否混淆变量名
      compress: {
        drop_console: false, // 删除 console 语句
        drop_debugger: false, // 删除 debugger 语句
        // pure_funcs: ['console.log'], // 删除特定的函数调用，如 console.log
      },
      format: {
        comments: true, // 是否保留注释
      },
    },
  },
})