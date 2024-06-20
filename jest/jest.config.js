/**
 * @type {import('jest').Config}
 */
const config = {
  testEnvironment: 'jsdom',
  rootDir: process.cwd(),
  modulePaths: ['<rootDir>/src'],
  roots: ['<rootDir>/jest/tests'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@mocks/(.*)$': '<rootDir>/jest/mocks/$1',
    '^@test-utils/(.*)': '<rootDir>/jest/utils/$1',
    '\\.(css|less)$': 'identity-obj-proxy',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest/mocks/file.js',
  },
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
    '^.+\\.svg$': 'jest-transformer-svg',
  },
  transformIgnorePatterns: [],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  setupFiles: ['<rootDir>/jest/jest.setup.js'],
  // setupFilesAfterEnv: ['<rootDir>/jest/setupAfterEnv.js'],
}

module.exports = config
