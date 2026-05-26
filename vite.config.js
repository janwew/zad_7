import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/zad_7/',
  plugins: [
    tailwindcss(),
  ],
});