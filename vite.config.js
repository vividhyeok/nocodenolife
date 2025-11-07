import { defineConfig } from 'vite';

export default defineConfig({
  root: 'site',
  build: {
    outDir: '../dist', // dist 폴더를 루트 기준으로 생성
    emptyOutDir: true
  },
  server: {
    port: 5173,
    open: true
  }
});