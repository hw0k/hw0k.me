# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Astro 5.8.0으로 구축된 개인 블로그 사이트(https://hw0k.me)입니다. 정적 사이트 생성기를 사용하며, 컨텐츠는 S3 버킷에서 관리되어 로컬 파일시스템으로 동기화됩니다.

## 개발 명령어

**개발 서버 시작:**
```bash
yarn dev
```

**사이트 빌드:**
```bash
yarn build
```
타입 체크(`astro check`)와 빌드(`astro build`)를 순차적으로 실행합니다.

**프로덕션 빌드 미리보기:**
```bash
yarn preview
```

**타입 체크만:**
```bash
astro check
```

**S3에서 컨텐츠 동기화:**
```bash
./scripts/sync-contents.sh
```

## 아키텍처

### 컨텐츠 관리 시스템
- 컨텐츠는 S3 버킷(`s3://hw0k-blog-obsidian-vault`)에 저장
- 두 개의 컨텐츠 컬렉션 정의:
  - `posts`: `src/contents/posts/`의 블로그 포스트
  - `custom-contents`: `src/contents/custom-contents/`의 정적 페이지
- 공통 스키마 사용: 필수 필드 `title`, `publishedAt`와 선택 필드 `description`, `updatedAt`, `tags`, `thumbnail`, `thumbnailAlt`
- 컨텐츠 동기화 시 `templates/*`와 `archives/*` 폴더 제외

### 주요 컴포넌트
- `src/components/layout.astro`: SEO 메타 태그, Google Analytics, 다크 모드 지원을 포함한 메인 레이아웃
- `src/components/change-theme.astro`: 다크 모드 토글
- `src/components/giscus-container.astro`: 댓글 시스템 통합
- `src/components/prose.astro`: 컨텐츠용 타이포그래피 래퍼

### 페이지 구조
- `src/pages/index.astro`: 포스트 목록을 보여주는 홈페이지
- `src/pages/about.astro`: 소개 페이지
- `src/pages/posts/[...id].astro`: 동적 포스트 페이지
- `src/pages/rss.xml.ts`: RSS 피드 생성
- `src/pages/404.astro`: 404 오류 페이지

### 유틸리티
- `src/libs/post-utils.ts`: markdown-it과 html-to-text를 사용해 포스트 요약을 생성하는 `getExcerptFromPostBody()` 함수
- `src/constants.ts`: CDN URL 상수

### 스타일링
- 커스텀 설정이 적용된 Tailwind CSS
- `selector` 전략으로 다크 모드 지원
- 커스텀 타이포그래피 플러그인 설정
- Pretendard Variable 폰트 프리로드
- 커스텀 브레이크포인트: `lg`를 768px로 설정

### 빌드 설정
- 정적 사이트 생성 (`output: 'static'`)
- `applyBaseStyles: false`로 Tailwind 통합
- 사이트맵 생성 활성화
- `cdn.hw0k.me` 도메인에 대한 이미지 최적화
- 엄격 모드와 경로 별칭(`~/*` -> `src/*`)이 적용된 TypeScript

## 패키지 매니저

이 프로젝트는 package.json에 명시된 대로 Yarn 4.5.0을 사용합니다. `npm` 대신 항상 `yarn` 명령어를 사용하세요.