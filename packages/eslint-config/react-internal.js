import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import { typescriptConfig } from "./typescript.js";

export const reactInternalConfig = [
  ...typescriptConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
];
