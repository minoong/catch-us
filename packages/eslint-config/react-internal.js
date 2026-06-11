import reactHooks from "eslint-plugin-react-hooks";
import { baseConfig } from "./base.js";

export const reactInternalConfig = [
  ...baseConfig,
  {
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
];
