module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
  },
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  plugins: ["jsx-a11y", "prettier", "import"],
  rules: {
    semi: 0,
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "prettier/prettier": [
      "error",
      {
        semi: false,
      },
    ],
    "linebreak-style": ["error", "unix"],
    eqeqeq: "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "no-console": 0,
    "react/prop-types": 0,
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal"],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
}
