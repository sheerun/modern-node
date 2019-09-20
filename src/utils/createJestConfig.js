const fs = require('fs')
const chalk = require('chalk')
const paths = require('../paths')

module.exports = (resolve, rootDir, isEjecting) => {
  // Use this instead of `paths.testsSetup` to avoid putting
  // an absolute filename into configuration after ejecting.
  const setupTestsMatches = paths.testsSetup.match(/test[/\\]setupTests\.(.+)/)
  const setupTestsFileExtension =
    (setupTestsMatches && setupTestsMatches[1]) || 'js'
  const setupTestsFile = fs.existsSync(paths.testsSetup)
    ? `<rootDir>/test/setupTests.${setupTestsFileExtension}`
    : undefined

  const config = {
    roots: ['<rootDir>/src', '<rootDir>/test'],

    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],

    setupFilesAfterEnv: setupTestsFile ? [setupTestsFile] : [],
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
      '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
      '<rootDir>/test/**/__tests__/**/*.{js,jsx,ts,tsx}',
      '<rootDir>/test/**/*.{spec,test}.{js,jsx,ts,tsx}'
    ],
    testEnvironment: 'jest-environment-node',
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$'
    ],
    moduleFileExtensions: [...paths.moduleFileExtensions, 'node'].filter(
      ext => !ext.includes('mjs')
    ),
    watchPlugins: [
      'jest-watch-typeahead/filename',
      'jest-watch-typeahead/testname'
    ]
  }
  if (rootDir) {
    config.rootDir = rootDir
  }
  const overrides = Object.assign({}, require(paths.appPackageJson).jest)
  const supportedKeys = [
    'collectCoverageFrom',
    'coverageReporters',
    'coverageThreshold',
    'coveragePathIgnorePatterns',
    'extraGlobals',
    'globalSetup',
    'globalTeardown',
    'moduleNameMapper',
    'resetMocks',
    'resetModules',
    'snapshotSerializers',
    'transform',
    'transformIgnorePatterns',
    'watchPathIgnorePatterns'
  ]
  if (overrides) {
    supportedKeys.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(overrides, key)) {
        if (Array.isArray(config[key]) || typeof config[key] !== 'object') {
          // for arrays or primitive types, directly override the config key
          config[key] = overrides[key]
        } else {
          // for object types, extend gracefully
          config[key] = Object.assign({}, config[key], overrides[key])
        }

        delete overrides[key]
      }
    })
    const unsupportedKeys = Object.keys(overrides)
    if (unsupportedKeys.length) {
      const isOverridingSetupFile =
        unsupportedKeys.indexOf('setupFilesAfterEnv') > -1

      if (isOverridingSetupFile) {
        console.error(
          chalk.red(
            'We detected ' +
              chalk.bold('setupFilesAfterEnv') +
              ' in your package.json.\n\n' +
              'Remove it from Jest configuration, and put the initialization code in ' +
              chalk.bold('test/setupTests.js') +
              '.\nThis file will be loaded automatically.\n'
          )
        )
      } else {
        console.error(
          chalk.red(
            '\nOut of the box, Create Modern Node only supports overriding ' +
              'these Jest options:\n\n' +
              supportedKeys
                .map(key => chalk.bold('  \u2022 ' + key))
                .join('\n') +
              '.\n\n' +
              'These options in your package.json Jest configuration ' +
              'are not currently supported by Create Modern Node:\n\n' +
              unsupportedKeys
                .map(key => chalk.bold('  \u2022 ' + key))
                .join('\n') +
              '\n\nIf you wish to override other Jest options, you need to ' +
              'eject from the default setup. You can do so by running ' +
              chalk.bold('npm run eject') +
              ' but remember that this is a one-way operation. ' +
              'You may also file an issue with Create Modern Node to discuss ' +
              'supporting more options out of the box.\n'
          )
        )
      }

      process.exit(1)
    }
  }
  return config
}
