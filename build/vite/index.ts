import react from '@vitejs/plugin-react'

export function createVitePlugins() {
  return [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ]
}
