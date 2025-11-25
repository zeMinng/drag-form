import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // 关闭原生 no-unused-vars
      'no-unused-vars': 'off',
      // 使用 TS 版 no-unused-vars，并忽略 _ 前缀
      '@typescript-eslint/no-unused-vars': ['warn', {
        args: 'all',
        argsIgnorePattern: '^_',
        vars: 'all',
        varsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_'
      }],
      // 是否可以空函数
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      // 是否可以any类型
      '@typescript-eslint/no-explicit-any': 'off',
      // 是否单引号
      'quotes': ['error', 'single'],
      'jsx-quotes': ['error', 'prefer-double'],
      // 禁用代码结尾分号
      'semi': ['error', 'never'],
    },
  },
])
