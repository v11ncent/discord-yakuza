module.exports = [
  {
    files: ["src/**/*.ts"],
    ignores: ["**/*.config.js", "*.json"],
    extends: ["airbnb-base", "airbnb-typescript/base", "prettier"],
  },
];
