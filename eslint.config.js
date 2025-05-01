/*import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";


export default defineConfig([ */
//  { files: ["**/*.{js,mjs,cjs,ts}"] },
 // { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
 // { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
//  tseslint.configs.recommended,
//]);

import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        import: true,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      //"semi": ["error", "never"],
      "semi": "off",
      "@typescript-eslint/strict-boolean-expressions": "warn",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "dist/**",
      "**/*.config.ts",
      ".eslintrc.js"
    ],
  },
]);