export interface ImportMetaEnv {
    readonly VITE_API_PREFIX: string
    readonly VITE_API_BASE_URL?: string
    readonly VITE_MODE?: string
}

export interface importMeta {
    readonly env: ImportMetaEnv
}