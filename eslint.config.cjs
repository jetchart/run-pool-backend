const tseslint = require('typescript-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = tseslint.config(
  {
    ignores: ['eslint.config.cjs'],
  },
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      // General JS/TS
      'no-warning-comments': ['warn', { location: 'anywhere' }],
      'no-unused-expressions': ['error', { allowShortCircuit: true }],
      'prefer-object-spread': 'error',

      // TypeScript
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': ['error'],
      '@typescript-eslint/naming-convention': [
        'warn',
        { selector: 'enumMember', format: ['UPPER_CASE'] },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
      // Prettier
      'prettier/prettier': 'warn',
    },
  }
);
