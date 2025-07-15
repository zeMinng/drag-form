import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'

export function createVitePlugins() {
  return [
    react(),
    AutoImport({
      imports: [
        'react',
        {
          'antd': [
            'Button', 'Input', 'Form', 'Flex',
          ]
        }
      ],
      dts: 'src/types/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
  ]
}
