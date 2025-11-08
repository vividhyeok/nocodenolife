#!/usr/bin/env node
/**
 * 프로젝트 자산 검증 스크립트
 * - projects.json 각 항목의 url이 games/ 로 시작하는 html/mp4/zip 인 경우 실제 파일 존재 검사
 * - thumb 경로 존재 여부 점검
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const siteDir = path.join(root, 'site');
const projectsPath = path.join(siteDir, 'projects.json');

function main(){
  if(!fs.existsSync(projectsPath)){
    console.error('projects.json 없음:', projectsPath); process.exit(1);
  }
  const raw = fs.readFileSync(projectsPath, 'utf-8');
  let items;
  try { items = JSON.parse(raw); } catch(e){ console.error('JSON 파싱 실패:', e.message); process.exit(1); }
  let missing = 0, missingThumb=0;
  for(const p of items){
    if(p.url && /^games\//.test(p.url)){ // local asset
      const assetPath = path.join(siteDir, p.url.replace(/\?.*/, ''));
      if(!fs.existsSync(assetPath)){
        console.warn('[경고] 게임 파일 없음:', p.id, '→', p.url);
        missing++;
      }
    }
    if(p.thumb && !/^https?:/.test(p.thumb)){
      const thumbPath = path.join(siteDir, p.thumb);
      if(!fs.existsSync(thumbPath)){
        console.warn('[썸네일 없음] 기본 썸네일 사용 권장:', p.thumb, '→', p.id);
        missingThumb++;
      }
    }
  }
  console.log(`검사 완료: 총 ${items.length}개 항목, 게임파일 누락 ${missing}개, 썸네일 누락 ${missingThumb}개`);
  if(missing>0){ console.log('누락 자산을 /site/games 에 추가 후 재커밋하세요.'); }
}

main();
