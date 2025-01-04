import globals from "globals";
import stylisticJs from '@stylistic/eslint-plugin-js'
import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
    },
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/linebreak-style': [
        'error',
        'unix'
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true },
      ],
      'no-console': 'off',
    },
  },
  { 
    ignores: ["dist/**", "build/**"],
  },
]

{/* npm install eslint @eslint/js --save-dev
  npx eslint --init
  npm install --save-dev @stylistic/eslint-plugin-js
  create a separate npm script for lintin in package.json "scripts" "lint": "eslint ."
  Now the npm run lint command will check every file in the project.
  Files in the dist directory also get checked when the command is run. We do not want this to happen, 
  and we can accomplish this by adding an object with the ignores property that specifies an array of 
  directories and files we want to ignore.
  // ...
export default [
  // ...
  { 
    ignores: ["dist/**"],
  },
  //...
]
    */}