/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['../../.eslintrc.js', 'next/core-web-vitals'],
  rules: {
    // JSX files legitimately use React implicit import in Next.js
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
