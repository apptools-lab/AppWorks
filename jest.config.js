module.exports = {
  coverageDirectory: './coverage/',
  collectCoverage: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['lib/', '__tests__/tmp/', '.tmp/', '/node_modules/'],
  modulePathIgnorePatterns: [
    '<rootDir>/extensions/react-refactor/',
  ],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['jest-extended'],
  setupFiles: ['./jest.setup.js'],
};
