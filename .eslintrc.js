/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'unused-imports', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-empty-interface': 'warn',
    'no-console': 'warn',
  },
  ignorePatterns: ['dist/', 'node_modules/', 'coverage/', '.next/', '*.js'],
  overrides: [
    {
      // console is expected in bootstrap entry, seeds, and migration scripts
      files: [
        '*.config.ts',
        '**/bootstrap/main.ts',
        '**/scripts/**/*.ts',
        '**/migrations/**/*.ts',
      ],
      rules: { 'no-console': 'off' },
    },
    {
      // scaffold contracts start empty intentionally — suppress until filled
      files: ['**/public/*.contract.ts'],
      rules: { '@typescript-eslint/no-empty-interface': 'off' },
    },
    {
      // relax any-usage in NestJS decorator-heavy layers
      files: ['apps/api/**/*.ts'],
      rules: { '@typescript-eslint/no-explicit-any': 'off' },
    },
  ],
};
