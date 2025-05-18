/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // 다른 환경 변수가 있다면 여기에 추가
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}