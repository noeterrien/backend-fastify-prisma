export default {
  testMatch: ["**/tests/**/*.test.js"],
  transform: {},
  extensionsToTreatAsEsm: [],
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
