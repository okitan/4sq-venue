// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  testEnvironment: "node",
  watchman: false,
  transform: {
    "^.+\\.ts$": ["ts-jest", { isolatedModules: true }],
  },
};
