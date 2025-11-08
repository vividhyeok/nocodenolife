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
  scripts/ (validate-projects.js 등 유틸)
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
`site/dist/` 폴더 생성 → 정적 산출물.

빌드 후 추가 복사:
`scripts/copy-static.js` 가 `projects.json`, `assets/` (이미지), `games/` 폴더를 dist 로 복사합니다. (Vite 가 동적 fetch 대상은 자동 수집하지 않기 때문)

## 게임 자산 추가 방법
1. HTML 실행형: `/site/games/your_game.html` 로 단일 HTML 배치 → `projects.json` `type: "html"` 로 등록.
2. 영상(mp4): `/site/games/your_video.mp4` 복사 → `type: "video"` 혹은 Minecraft 시연이면 `type: "minecraft"`.
3. ZIP 배포: `/site/games/your_pack.zip` → `type: "zip"` (모달에서 다운로드 버튼).
4. Scratch: 원본 URL `https://scratch.mit.edu/projects/<id>/` → `url` 에 `.../embed` 형태로 바로 넣고 `type: "embed"`.
5. 썸네일: `site/assets/` 폴더에 `teamX.png` 등 배치 후 `thumb` 경로 지정. 없을 경우 자동 기본 썸네일.

검증 스크립트 실행 (누락 파일 확인):
```bash
node scripts/validate-projects.js
```

## Vercel 배포
1. GitHub 에 `nocodenolife/` 폴더를 루트로 push (또는 저장소 자체로 사용)
2. Vercel 대시보드에서 Import → build command 자동(`npm run build`)
3. outputDirectory 는 `site/dist` (vercel.json 정의; 프로젝트 루트는 저장소 루트)
4. 배포 후 CDN 경로에서 `projects.json` 캐시가 길게 유지될 수 있으니 변경 시 재배포.

## projects.json 항목 규칙
- `type`: `embed` | `html` | `zip` | `video` | `minecraft` 등 (UI 필터/모달 분기)
- `thumb` 경로가 404 면 기본 `thumb-default.svg` 로 fallback 처리됨.
- `details` 필드(선택) → 팀 상세 모달 표시.
- `url` 이 `games/` 로 시작하면 로컬 정적 파일, 그 외엔 외부 임베드/절대 경로.
- 새 항목 추가 시 쉼표 및 JSON 유효성(문법) 주의.

## 애니메이션 / UX
- Skeleton 로딩 → 초기 비어있을 때 깜박임 최소화
- IntersectionObserver 카드 순차 등장(Reveal)
- 버튼 / 칩 Ripple 효과
- 카드 3D 틸트 (마우스 위치 기반)
- 모달 페이드/스케일 트랜지션
- 라이트/다크 테마 토글 버튼
- `prefers-reduced-motion` 사용자 환경 존중(Fade/Animation 제거)
 - Canvas 샘플 게임(`flappy.html`) 포함

## 커스터마이징 포인트
- 카드 틸트 강도: `app.js` 내부 `tiltX/tiltY` 8 → 4~6 조정 권장
- 테마 토글 지속: localStorage 로 유지하려면 클릭 핸들러에 저장/복원 코드 추가
- 필터 확장: `chip` 버튼 추가 후 `wireFilters` 로직에 조건 추가

## 배포 체크리스트
- 프로젝트 추가 시 `projects.json` 수정 → 커밋 → Vercel 빌드 트리거
- 대용량 영상/ZIP 은 가능하면 외부 스토리지(CDN) 경로로 링크 (빌드 시간/배포 용량 감소)
- Scratch 임베드 실패 시 네트워크 차단/X-Frame-Options 여부 확인

행복한 개발 되세요 🚀
