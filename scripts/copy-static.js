// copy-static.js
// 빌드 결과(dist)에 Vite 가 자동 복사하지 않는 정적 참조(프로젝트 JSON, 썸네일 이미지, games 폴더)를 포함시킴
// 이유: projects.json 및 썸네일/게임 파일들은 JS fetch 나 동적 경로로만 참조되어
//       번들링 과정에서 트리 추적되지 않아 누락될 수 있음.

import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd(), 'site');
const dist = path.join(root, 'dist');

function copyFile(src, dest){
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log('copied', path.relative(root, src), '->', path.relative(root, dest));
}

function copyDir(srcDir, destDir){
  if(!fs.existsSync(srcDir)) return;
  for(const entry of fs.readdirSync(srcDir)){
    const srcPath = path.join(srcDir, entry);
    const destPath = path.join(destDir, entry);
    const stat = fs.statSync(srcPath);
    if(stat.isDirectory()) copyDir(srcPath, destPath);
    else copyFile(srcPath, destPath);
  }
}

function main(){
  if(!fs.existsSync(dist)){ console.error('dist 폴더가 존재하지 않습니다. build 단계 실패?'); process.exit(1); }

  // projects.json 복사
  const projectsJson = path.join(root, 'projects.json');
  if(fs.existsSync(projectsJson)){
    copyFile(projectsJson, path.join(dist, 'projects.json'));
  } else {
    console.warn('projects.json 을 찾을 수 없습니다. 갤러리 로드가 실패할 수 있습니다.');
  }

  // assets 폴더 전체 복사(이미지/썸네일 등)
  copyDir(path.join(root, 'assets'), path.join(dist, 'assets'));

  // games 폴더 복사(HTML/영상/ZIP 등)
  copyDir(path.join(root, 'games'), path.join(dist, 'games'));

  // teams 폴더 복사(팀별 상세 페이지)
  copyDir(path.join(root, 'teams'), path.join(dist, 'teams'));

  console.log('정적 추가 자산 복사 완료.');
}

main();