const typescriptEslint = require("@typescript-eslint/eslint-plugin")
const expoConfig = require("eslint-config-expo/flat")
const prettierConfig = require("eslint-config-prettier")
const prettierPlugin = require("eslint-plugin-prettier")
const reactotronPlugin = require("eslint-plugin-reactotron")

module.exports = [
  {
    ignores: ["node_modules", "ios", "android", ".expo", ".vscode", "ignite/ignite.json"],
  },
  ...expoConfig,
  prettierConfig,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.d.ts"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      "no-unused-expressions": "off",
      "@typescript-eslint/no-array-constructor": "error",
      "@typescript-eslint/no-duplicate-enum-values": "error",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/no-unnecessary-type-constraint": "error",
      "@typescript-eslint/no-unsafe-declaration-merging": "error",
      "@typescript-eslint/no-unsafe-function-type": "error",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/triple-slash-reference": "error",
    },
  },
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "prettier": prettierPlugin,
      "reactotron": reactotronPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "reactotron/no-tron-in-production": "error",

      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      "import/no-named-as-default": "off",
      "import/no-duplicates": "off",

      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: ["default"],
              message: "Import named exports from 'react' instead.",
            },
            {
              name: "react-native",
              importNames: ["SafeAreaView"],
              message: "Use the SafeAreaView from 'react-native-safe-area-context' instead.",
            },
            {
              name: "react-native",
              importNames: ["Text", "Button", "TextInput"],
              message: "Use the custom wrapper component from '@/components'.",
            },
          ],
        },
      ],

      "import/order": [
        "error",
        {
          "alphabetize": {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "always",
          "groups": [
            ["builtin", "external"],
            "internal",
            "unknown",
            ["parent", "sibling"],
            "index",
          ],
          "distinctGroup": false,
          "pathGroups": [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "react-native", group: "external", position: "before" },
            { pattern: "expo{,-*}", group: "external", position: "before" },
            { pattern: "@/**", group: "unknown", position: "after" },
          ],
          "pathGroupsExcludedImportTypes": ["react", "react-native", "expo", "expo-*"],
        },
      ],
      "import/newline-after-import": "warn",
    },
  },
]
