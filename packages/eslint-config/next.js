import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

import { tailwindConfig } from "./tailwind.js";
import { typescriptConfig } from "./typescript.js";

export const nextConfig = defineConfig([
  ...typescriptConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
  },
  ...nextVitals,
  ...nextTypescript,
  {
    languageOptions: jsxA11y.flatConfigs.recommended.languageOptions,
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  ...tailwindConfig,
  {
    settings: {
      // Avoid eslint-plugin-react 7.37.5's ESLint 10-incompatible auto-detection.
      react: {
        version: "19.2",
      },
    },
    rules: {
      "import/no-anonymous-default-export": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
