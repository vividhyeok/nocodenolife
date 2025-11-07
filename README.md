# No Code No Life – Game Showcase (Vercel Deploy)

이 디렉터리는 `site/` 정적 리소스를 Vite 로 빌드하여 Vercel 에 올리기 위한 최소 구조입니다.

## 구조
```
nocodenolife/
  package.json
  vite.config.js
  vercel.json
  site/
    index.html
    projects.json
    assets/ (style.css, app.js, logo.svg, thumb-default.svg, team*.png)
    games/  (HTML, mp4, zip 등 배치)
```

## 개발
```bash
npm install
npm run dev
```
브라우저: http://localhost:5173

## 빌드 & 미리보기
```bash
npm run build
npm run preview
```
`dist/` 폴더 생성 → 정적 산출물.

## Vercel 배포
1. GitHub 에 `nocodenolife/` 폴더를 루트로 push (또는 저장소 자체로 사용)
2. Vercel 대시보드에서 Import → build command 자동(`npm run build`)
3. outputDirectory 는 `dist` (vercel.json 정의)
4. 배포 후 CDN 경로에서 `projects.json` 캐시가 길게 유지될 수 있으니 변경 시 재배포.

## projects.json 항목 규칙
- `type`: `embed` | `html` | `zip` | `video` | `minecraft` 등 (UI 필터/모달 분기)
- `thumb` 경로가 404 면 기본 `thumb-default.svg` 로 fallback 처리됨.
- `details` 필드(선택) → 팀 상세 모달 표시.

## 애니메이션 / UX
- Skeleton 로딩 → 초기 비어있을 때 깜박임 최소화
- IntersectionObserver 카드 순차 등장(Reveal)
- 버튼 / 칩 Ripple 효과
- 카드 3D 틸트 (마우스 위치 기반)
- 모달 페이드/스케일 트랜지션
- 라이트/다크 테마 토글 버튼
- `prefers-reduced-motion` 사용자 환경 존중(Fade/Animation 제거)

## 커스터마이징 포인트
- 카드 틸트 강도: `app.js` 내부 `tiltX/tiltY` 8 → 4~6 조정 권장
- 테마 토글 지속: localStorage 로 유지하려면 클릭 핸들러에 저장/복원 코드 추가
- 필터 확장: `chip` 버튼 추가 후 `wireFilters` 로직에 조건 추가

## 배포 체크리스트
- 프로젝트 추가 시 `projects.json` 수정 → 커밋 → Vercel 빌드 트리거
- 대용량 영상/ZIP 은 가능하면 외부 스토리지(CDN) 경로로 링크 (빌드 시간/배포 용량 감소)
- Scratch 임베드 실패 시 네트워크 차단/X-Frame-Options 여부 확인

행복한 개발 되세요 🚀
