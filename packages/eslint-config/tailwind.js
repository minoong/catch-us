import { defineConfig } from "eslint/config";
import tailwindcss from "eslint-plugin-tailwindcss";

export const tailwindConfig = defineConfig([
  ...tailwindcss.configs["flat/recommended"],
  {
    settings: {
      tailwindcss: {
        callees: ["classnames", "clsx", "cn", "ctl", "cva", "tv"],
        config: {},
      },
    },
    rules: {
      "tailwindcss/classnames-order": "off",
      // The v4 beta rejects valid CSS theme tokens such as text-muted-foreground.
      "tailwindcss/no-custom-classname": "off",
    },
  },
]);
