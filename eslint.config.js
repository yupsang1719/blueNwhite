import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Ignore uppercase vars (React components like Icon, SiReact…)
      // and `motion` which is used as a JSX namespace (motion.div, motion.span)
      // ESLint v9 no-unused-vars doesn't track JSX member expressions as usage
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]|^motion$',
        argsIgnorePattern: '^_|^[A-Z]',
        caughtErrorsIgnorePattern: '^_',
      }],
    },
  },
])
