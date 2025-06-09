module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.spec.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
