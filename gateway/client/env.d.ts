/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
