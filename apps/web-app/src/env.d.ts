// Declara VITE_API_URL para que TypeScript la trate como texto y no como `any`.
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}
