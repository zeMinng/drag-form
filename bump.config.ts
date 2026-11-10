import { defineConfig } from 'bumpp'

export default defineConfig({
  files: ['package.json'],
  commit: 'chore: release {tag}',
  tag: 'v{version}',
  push: false,
})
