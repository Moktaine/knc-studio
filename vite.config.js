import { defineConfig } from 'vite';

// Relative base: the built site works from any folder, including a GitHub Pages
// project URL like https://<user>.github.io/<repo>/, without knowing the repo name.
export default defineConfig({
  base: './',
});
