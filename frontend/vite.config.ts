import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/PDF_insight/', // GitHub Pages serves the site under the repository name
});
