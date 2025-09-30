// Flat ESLint config for TypeScript + React + Prettier
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  // Ignore build artifacts and vendored code
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**', '**/*.config.ts', 'vite.config.*', 'eslint.config.*'] },

  // Base JS rules
  js.configs.recommended,

  // TypeScript recommended
  ...tseslint.configs.recommended,

  // React + Hooks rules for TS/TSX files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        projectService: true,
        allowDefaultProject: true,
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { react: reactPlugin, 'react-hooks': reactHooks },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      ...reactHooks.configs.recommended.rules,
    },
    settings: { react: { version: 'detect' } },
  },

  // Disable rules that conflict with Prettier
  eslintConfigPrettier,
];
