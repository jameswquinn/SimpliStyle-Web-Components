// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/simplistyle-components.js'),
      name: 'SimpliStyle',
      fileName: (format) => `simplistyle.${format}.js`
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  },
  plugins: [
    {
      name: 'custom-css-plugin',
      generateBundle(options, bundle) {
        bundle['simplistyle-global.css'] = {
          isAsset: true,
          type: 'asset',
          fileName: 'simplistyle-global.css',
          source: require('fs').readFileSync(resolve(__dirname, 'src/simplistyle-global.css'), 'utf-8')
        };
      }
    }
  ]
});
