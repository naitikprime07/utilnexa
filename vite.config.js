import { defineConfig } from 'vite';
import { cpSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
export default defineConfig({
  appType: 'mpa',
  server: { host: '0.0.0.0' },
  plugins: [{
    name: 'include-static-blog-pages',
    writeBundle() {
      for (const name of ['assets', 'renovation', ...readdirSync('.').filter(name => name.endsWith('.html') && name !== 'index.html')]) {
        cpSync(resolve(name), resolve('dist', name), { recursive: true });
      }
    },
  }],
});
