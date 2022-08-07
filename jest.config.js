module.exports = {
    testEnvironment: 'jsdom',
    collectCoverageFrom: [
      'src/**/*.{js,jsx}',
      '!src/**/*.test.{js,jsx}',
      '!src/App.js',
      '!src/services/*.js',
      '!src/index.js',
      '!src/reportWebVitals.js',
      '!src/setupTests.js',
      '!src/mockAPI/index.js',
      '!src/components/PrivateRoute.js'
    ],
    coverageThreshold: {
      global: {
        statements: 98,
        branches: 91,
        functions: 98,
        lines: 98,
      },
    },
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
      '.*\\.(css|less|styl|scss|sass)$': '<rootDir>/internals/mocks/cssModule.js',
      '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/internals/mocks/image.js',
    },
    setupFilesAfterEnv: [
      '<rootDir>/internals/testing/test-bundler.js',
    ],
    setupFiles: ['raf/polyfill'],
    testRegex: '__tests__/.*\\.test\\.(js|jsx)$',
    snapshotSerializers: [],
    restoreMocks: true,
  };
  