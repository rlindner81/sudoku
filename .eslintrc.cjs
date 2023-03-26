/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

const OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = {
  root: true,
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier",
  ],
  rules: {
    "vue/multi-word-component-names": OFF,
  },
};
