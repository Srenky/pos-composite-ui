import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { dependencies } from "./package.json";

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 2001,
  },
  dev: {
    assetPrefix: "http://localhost:2001",
  },
  output: {
    assetPrefix: "https://deykrfi39q5e8.cloudfront.net/dist",
    distPath: {
      js: "",
      css: "",
    },
  },
  moduleFederation: {
    options: {
      name: "kitchen_app",
      filename: "remoteEntry.js",
      exposes: {
        "./Kitchen": "./src/App",
      },
      shared: {
        ...dependencies,
        react: {
          singleton: true,
          requiredVersion: dependencies["react"],
        },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
        },
      },
    },
  },
});
