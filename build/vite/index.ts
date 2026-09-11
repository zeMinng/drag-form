import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export function createVitePlugins() {
  return [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ]
}
