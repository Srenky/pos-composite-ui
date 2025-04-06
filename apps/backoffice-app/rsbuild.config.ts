import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { dependencies } from "./package.json";

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 2003,
  },
  dev: {
    assetPrefix: "http://localhost:2003",
  },
  output: {
    assetPrefix: "https://d208n0u9022trs.cloudfront.net/dist",
    distPath: {
      js: "",
      css: "",
    },
  },
  moduleFederation: {
    options: {
      name: "backoffice_app",
      filename: "remoteEntry.js",
      exposes: {
        "./Backoffice": "./src/App",
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
