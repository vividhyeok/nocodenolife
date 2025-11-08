import { defineConfig } from 'vite';

// NOTE:
// 기존 outDir '../dist' 은 Vercel root("site") 밖으로 빌드 결과를 내보내어
// vercel.json 의 outputDirectory 탐지와 충돌을 일으킬 수 있음.
// dist 를 root 내부("site/dist")에 두고 vercel.json 에서 outputDirectory:"dist" 로 지정하면
// Vercel 이 정상적으로 정적 산출물을 배포하며, 후속 copy 스크립트로 추가 JSON/이미지 자산을 포함시킬 수 있음.
export default defineConfig({
  root: 'site',
  base: './', // GitHub Pages 등 서브 경로 배포 시 정적 자산 상대 경로 보장
  build: {
    outDir: 'dist', // 빌드 산출물: site/dist
    emptyOutDir: true
  },
  server: {
    port: 5173,
    open: true
  }
});