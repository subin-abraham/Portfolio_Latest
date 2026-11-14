/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEON_AUTH_URL?: string;
  readonly VITE_ENABLE_ADMIN_REGISTRATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
