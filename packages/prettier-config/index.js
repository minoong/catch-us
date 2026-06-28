import * as prettierPluginTailwindcss from "prettier-plugin-tailwindcss";

/** @type {import("prettier").Config} */
const config = {
  endOfLine: "lf",
  plugins: [prettierPluginTailwindcss],
};

export default config;
