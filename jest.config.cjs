module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setupTests.js'],
  testMatch: ['<rootDir>/tests/unit/**/*.test.js?(x)'],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './test-report',
        filename: 'report.html',
        expand: true
      }
    ]
  ]
};