module.exports = {
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "^react-router-dom$": "<rootDir>/node_modules/react-router-dom",
      "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js"
    },
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    }
  };