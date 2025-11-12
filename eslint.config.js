import path from "node:path";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

const ROOT = path.resolve(new URL('.', import.meta.url).pathname);

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    ignores: ["node_modules", "dist", "build"],
  },

  {
    files: ["server/src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: [path.resolve(ROOT, "server/tsconfig.json")],
        tsconfigRootDir: ROOT, // ✅ locks to /k8-keystone
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: { ...globals.node },
    },
  },

  {
    files: ["client/src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: [path.resolve(ROOT, "client/tsconfig.json")],
        tsconfigRootDir: ROOT, // ✅ same root
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, React: "readonly" },
    },
  },
];
