const { pathsToModuleNameMapper } = require('ts-jest/utils');

const { compilerOptions } = require('./tsconfig.json');
const paths = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: '<rootDir>/',
});

/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json-summary', 'lcov', 'text', 'clover'],
  preset: 'ts-jest',
  moduleNameMapper: {
    ...paths,
  },
  testPathIgnorePatterns: [
    'node_modules',
    '\\.cache',
    '<rootDir>/build',
    '<rootDir>/dist',
    '<rootDir>/coverage',
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  testURL: 'http://localhost',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.env.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
