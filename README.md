# 📦 ever-hooks

React 프로젝트에서 자주 쓰이는 Custom Hook 모음집
16종 이상의 훅을 포함하고 있으며, 실제 프로젝트에서 바로 가져다 쓸 수 있도록 gitsubmodule과 npm 방식 둘 다 지원합니다.

## 🚀 설치 방법

### 1) Git Submodule로 설치

프로젝트 루트에서 실행

```
git submodule add https://github.com/owen-ever/ever-hooks.git
```

업데이트 시

```
git submodule update --remote --merge
```

이후 프로젝트 내에서  
tsconfig.json에 paths를 설정하고 사용
```
...
"paths": {
  ...,
  "@/ever-hooks": ["./src/modules/ever-hooks/src"]
}
```

```
import { useToggle } from '@/ever-hooks';
```


### 2) NPM 패키지로 설치 (옵션)

```
bun add ever-hooks
```

사용 예시

```
import { useToggle } from 'ever-hooks';
```

## 📂 프로젝트 구조

```
ever-hooks/
 ├─ dist/            # 빌드 결과물
 ├─ ...
 ├─ src/
 │   ├─ demo/        # 사용 예제 (배포 제외)
 │   ├─ hooks/       # 실제 훅 구현부
 │   └─ index.ts     # 훅 export
 ├─ ...
 ├─ package.json
 ├─ tsup.config.ts   # tsup 빌드 설정
 └─ README.md
```

## 🛠️ 사용 가능한 Hook 목록

- 유틸리티
  - useToggle – 토글 값 관리
  - usePrevious – 이전 값 추적
  - useDebounce – 디바운스 이벤트 처리
  - useThrottle – 쓰로틀 이벤트 처리
- UI/상호작용
  - useFocusOut – 외부 클릭 감지
  - useHover – 호버 상태 감지
  - useBreakpoint – 화면 크기별 상태 반환
  - useMediaQuery – 미디어쿼리 매칭
  - useInterval – 인터벌 관리
- 데이터/네트워크
  - useFetch – API 요청 관리
  - useIndexedDB – IndexedDB 데이터 관리
  - useWebSocket – WebSocket 연결/메시지 관리
  - useInfiniteScroll – 무한 스크롤 이벤트
- 특수
  - useBeforeunload – 페이지 이탈 감지
  - useTraceLog – 디버깅/트레이스 로깅
  - useQuantumShare – 다수 컴포넌트 간 상태 공유

## 📖 사용 예시 (Demo)

예: useToggle

```tsx
import { useToggle } from "ever-hooks";

export default function ToggleDemo() {
  const { value, toggle, setTrue, setFalse } = useToggle();

  return (
    <div>
      <p>현재 값: {value ? 'ON' : 'OFF'}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setTrue}>Set True</button>
      <button onClick={setFalse}>Set False</button>
    </div>
  );
}
```

## 🧪 테스트

현재 저장소는 테스트 실행 구성을 포함하지 않습니다.

## 📦 빌드

```
bun run build
```

- 번들러: tsup
- 출력: dist/ (CJS, ESM, DTS 지원)

## 📚 문서화

```
bun run typedoc
```

→ 자동 생성된 훅 API 문서를 확인할 수 있습니다.

## ⚡ 개발자 가이드

- 데모 실행

```
bun run dev
```

→ src/demo를 Vite로 실행해 훅 동작 확인 가능

- 코드 규칙
  - ESLint + Prettier 적용
  - 커밋 시 Husky를 통한 린트 검사

## 🙌 기여

PR, 이슈 환영합니다!

- 새로운 훅 제안
- 기존 훅 개선/리팩토링
- 문서화/데모 개선
