import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  // Retain the existing React behavior while migrating the framework.
  // Compiler-oriented suggestions are separate from correctness checks.
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  globalIgnores([".next/**", "node_modules/**", "next-env.d.ts"]),
]);
