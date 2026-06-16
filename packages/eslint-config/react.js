import { defineConfig } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

import { tailwindConfig } from "./tailwind.js";
import { typescriptConfig } from "./typescript.js";

export const reactConfig = defineConfig([
  ...typescriptConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
  },
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat.recommended,
  ...tailwindConfig,
]);
