const path = require('path')
const fs = require('fs')

// Make sure any symlinks in the project folder are resolved:
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx'
]

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  )

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  return resolveFn(`${filePath}.js`)
}

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  appNodeModules: resolveApp('node_modules')
}

// @remove-on-eject-begin
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath)

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  appNodeModules: resolveApp('node_modules'),
  // These properties only exist before ejecting:
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'), // This is empty on npm 3
  appTypeDeclarations: resolveApp('src/modern-node-env.d.ts'),
  ownTypeDeclarations: resolveOwn('lib/modern-node.d.ts')
}

const ownPackageJson = require('../package.json')
const modernNodePath = resolveApp(`node_modules/${ownPackageJson.name}`)
const modernNodeLinked =
  fs.existsSync(modernNodePath) && fs.lstatSync(modernNodePath).isSymbolicLink()

if (
  !modernNodeLinked &&
  __dirname.indexOf(path.join('packages', 'modern-node', 'src')) !== -1
) {
  module.exports = {
    dotenv: resolveOwn('template/.env'),
    appPath: resolveApp('.'),
    appBuild: resolveOwn('../../build'),
    appIndexJs: resolveModule(resolveOwn, 'template/src/index'),
    appPackageJson: resolveOwn('package.json'),
    appSrc: resolveOwn('template/src'),
    appTsConfig: resolveOwn('template/tsconfig.json'),
    appJsConfig: resolveOwn('template/jsconfig.json'),
    yarnLockFile: resolveOwn('template/yarn.lock'),
    testsSetup: resolveModule(resolveOwn, 'template/src/setupTests'),
    appNodeModules: resolveOwn('node_modules'),
    // These properties only exist before ejecting:
    ownPath: resolveOwn('.'),
    ownNodeModules: resolveOwn('node_modules'),
    appTypeDeclarations: resolveOwn('template/src/modern-node-env.d.ts'),
    ownTypeDeclarations: resolveOwn('src/modern-node.d.ts')
  }
}

module.exports.moduleFileExtensions = moduleFileExtensions
