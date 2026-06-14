import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { flatConfigs as importXFlatConfigs } from "eslint-plugin-import-x";
import turboPlugin from "eslint-plugin-turbo";

export const baseConfig = defineConfig([
  globalIgnores([
    "**/.next/**",
    "**/.turbo/**",
    "**/coverage/**",
    "**/dist/**",
    "**/node_modules/**",
  ]),
  eslint.configs.recommended,
  importXFlatConfigs.recommended,
  {
    plugins: { turbo: turboPlugin },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
      reportUnusedInlineConfigs: "error",
    },
    rules: {
      "import-x/first": "error",
      "import-x/no-duplicates": "error",
      "import-x/no-unresolved": "off",
      "turbo/no-undeclared-env-vars": "error",
    },
  },
  eslintConfigPrettier,
]);
