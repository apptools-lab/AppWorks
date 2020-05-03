module.exports = {
  coverageDirectory: './coverage/',
  collectCoverage: true,
  testPathIgnorePatterns: [
    'lib/',
    '__tests__/tmp/',
    '/node_modules/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/packages/generate-project/',
    '<rootDir>/packages/ice-npm-utils/',
    '<rootDir>/packages/config/',
  ],
  preset: 'ts-jest',
  setupFilesAfterEnv: [
    'jest-extended'
  ],
  setupFiles: [
    './jest.setup.js'
  ]
};
