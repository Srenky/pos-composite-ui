import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 3123,
  },
  dev: {
    // It is necessary to configure assetPrefix, and in the production environment, you need to configure output.assetPrefix
    assetPrefix: true,
  },
  moduleFederation: {
    options: {
      name: 'main_app',
      remotes: {
        backoffice_app: process.env.BACKOFFICE_URL ?? '',
        checkout_app: process.env.CHECKOUT_URL ?? '',
        kitchen_app: process.env.KITCHEN_URL ?? '',
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
      },
    },
  },
});
