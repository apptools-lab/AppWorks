module.exports = {
  coverageDirectory: './coverage/',
  collectCoverage: true,
  testPathIgnorePatterns: [
    'lib/',
    '__tests__/tmp/'
  ],
  preset: 'ts-jest',
  setupFilesAfterEnv: [
    'jest-extended'
  ]
};
