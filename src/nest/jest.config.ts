const core_path = '<rootDir>/../../../node_modules/core/dist';

export default {
  displayName: {
    name: 'nest',
    color: 'magentaBright',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../__coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '/core/(.*)$/': `${core_path}/$1`,
    '#seedwork/(.*)$': `${core_path}/@seedwork/$1`,
    '#user/(.*)$': `${core_path}/user/$1`,
  },
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
