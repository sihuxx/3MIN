import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// SINGLE=1 npm run build → dist-single/index.html 하나로 묶어서 더블클릭으로 열 수 있게 만듦
const single = process.env.SINGLE === '1'

export default defineConfig({
  base: './',
  plugins: single ? [react(), viteSingleFile()] : [react()],
  build: single ? { outDir: 'dist-single' } : {},
})
