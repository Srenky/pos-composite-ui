import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { dependencies } from './package.json';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 2002,
  },
  dev: {
    assetPrefix: 'http://localhost:2002',
  },
  output: {
    assetPrefix: 'https://dgzxknnir1pvv.cloudfront.net/dist',
    distPath: {
      js: '',
      css: '',
    },
  },
  moduleFederation: {
    options: {
      name: 'checkout_app',
      filename: 'remoteEntry.js',
      exposes: {
        './Checkout': './src/App',
      },
      shared: {
        ...dependencies,
        react: {
          singleton: true,
          requiredVersion: dependencies['react'],
        },
        'react-dom': {
          singleton: true,
          requiredVersion: dependencies['react-dom'],
        },
      },
    },
  },
});
