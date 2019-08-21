module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier/@typescript-eslint',
    'prettier/react'
  ],
  plugins: [
    'import', '@typescript-eslint', 'react-hooks'
  ],
  env: { 'node': true, 'es6': true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-return-assign': 0,
    'no-console': 2,
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'index', 'sibling', 'parent'],
      'newlines-between': 'always',
    }],
    'import/no-named-export': 0,
    'import/newline-after-import': 2,
    'import/named': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react/display-name': 0,
    'react/jsx-filename-extension': [ 1, {'extensions': ['.tsx'] }],
    'react/prop-types': 0,
  },
  settings: {
    react: {
      version: 'detect',
    }
  }
}
