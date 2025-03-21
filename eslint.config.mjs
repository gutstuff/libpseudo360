import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "script"}},
  {languageOptions: { 
    globals: globals.browser,
    ecmaVersion: 5,
    sourceType: "script"
  }},
  pluginJs.configs.recommended,
];