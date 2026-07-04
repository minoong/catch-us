import { defineConfig } from "eslint/config";

import { nextConfig } from "@repo/eslint-config/next";

const registryGeneratedVisualComponents = [
  "{apps/web/,}components/Aurora.tsx",
  "{apps/web/,}components/AnimatedList.tsx",
  "{apps/web/,}components/CircularGallery.tsx",
  "{apps/web/,}components/Noise.tsx",
  "{apps/web/,}components/PillNav.tsx",
  "{apps/web/,}components/ScrollFloat.tsx",
  "{apps/web/,}components/ScrollStack.tsx",
  "{apps/web/,}components/Silk.tsx",
  "{apps/web/,}components/SplitText.tsx",
  "{apps/web/,}components/magicui/animated-beam.tsx",
  "{apps/web/,}components/magicui/animated-gradient-text.tsx",
  "{apps/web/,}components/magicui/animated-grid-pattern.tsx",
  "{apps/web/,}components/magicui/aurora-text.tsx",
  "{apps/web/,}components/magicui/backlight.tsx",
  "{apps/web/,}components/magicui/bento-grid.tsx",
  "{apps/web/,}components/magicui/border-beam.tsx",
  "{apps/web/,}components/magicui/iphone.tsx",
  "{apps/web/,}components/magicui/marquee.tsx",
];

export default defineConfig([
  ...nextConfig,
  {
    files: registryGeneratedVisualComponents,
    rules: {
      // Registry files are generated visual-effect code. Keep
      // exceptions exact-file scoped so app code still follows the shared rules.
      "@next/next/no-img-element": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/non-nullable-type-assertion-style": "off",
      "@typescript-eslint/prefer-regexp-exec": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "import-x/named": "off",
      "import-x/no-duplicates": "off",
      "jsx-a11y/no-noninteractive-tabindex": "off",
      "no-empty": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "tailwindcss/enforces-negative-arbitrary-values": "off",
    },
  },
]);
