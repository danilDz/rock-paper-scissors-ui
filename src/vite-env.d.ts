/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_JWT_EXPIRE_HOURS: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
