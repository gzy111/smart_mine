interface ImportMetaEnv {
    readonly VITE_APP_BASE_API: string
    readonly VITE_APP_TITLE: string

    // 更多环境变量...
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  