import js from '@eslint/js';
import globals from 'globals';
import eslintReact from '@eslint-react/eslint-plugin';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'build/**',
      'coverage/**',
      'lighthouse-reports/**',
      '.lighthouseci/**',
      '.lighthouserc.*',
      '.oc/**',
      'public/**',
      '*.min.js',
      'HRNet-original/**',
    ],
  },
  js.configs.recommended,
  {
    files: [
      'eslint.config.js',
      'stylelint.config.js',
      'vite.config.ts',
      'scripts/**/*.mjs',
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'no-control-regex': 'off',
    },
  },
  {
    files: ['src/**/*.{js,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    ...eslintReact.configs['strict-type-checked'],
    files: ['src/**/*.{jsx,tsx}'],
    languageOptions: {
      ...eslintReact.configs['strict-type-checked'].languageOptions,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      '@eslint-react/purity': 'error',
      '@eslint-react/immutability': 'error',
      '@eslint-react/refs': 'error',
      '@eslint-react/set-state-in-effect': 'error',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['src/context/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  prettier,
];
