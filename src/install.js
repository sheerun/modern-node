const fs = require('fs')
const path = require('path')
const os = require('os')
const readPkgUp = require('read-pkg-up')

const { getGitFolderPath } = require('./utils')

const env = process.env
const isCi =
  env.CI || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, dsari
  env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
  env.BUILD_NUMBER || // Jenkins, TeamCity
  env.RUN_ID

if (isCi && !env.FORCE_POSTINSTALL) {
  return
}

const root = path.resolve(__dirname, '..')
const git = getGitFolderPath(root)

// Bail out if we don't have an `.git` directory as the hooks will not get
// triggered. If we do have directory create a hooks folder if it doesn't exist.
if (!git) {
  console.warn('Not found any .git folder for installing pre-commit hook')
  console.warn('Please install modern-node again after initializing repository')
  return
}

let pkg
try {
  const result = readPkgUp.sync({ cwd: path.dirname(git), normalize: false })
  if (result) {
    pkg = result.packageJson
  }
} catch (err) {
  if (err.code !== 'ENOENT') {
    throw err
  }
}

if (!pkg) {
  return
}

;['pre-commit'].forEach(function (dep) {
  if (pkg.dependencies && pkg.dependencies[dep]) {
    console.warn(
      'package.json: Please remove ' + dep + ' from your dependencies'
    )
  }

  if (pkg.devDependencies && pkg.devDependencies[dep]) {
    console.warn(
      'package.json: Please remove ' + dep + ' from your devDependencies'
    )
  }
})

if (pkg['pre-commit']) {
  console.warn(
    'package.json: Please move pre-commit field to scripts.precommit'
  )
}

if (pkg.precommit) {
  console.warn('package.json: Please move precommit field to scripts.precommit')
}

if (pkg.husky && pkg.husky.hooks && pkg.husky['pre-commit']) {
  console.warn(
    'package.json: Please move husky.hooks.pre-commit to scripts.precommit'
  )
}

const hooks = path.join(git, 'hooks')
if (!fs.existsSync(hooks)) fs.mkdirSync(hooks)

// If there's an existing `pre-commit` hook we want to back it up instead of
// overriding it and losing it completely as it might contain something
// important.
const precommit = path.join(hooks, 'pre-commit')
const precommitPath = path.join(__dirname, 'precommit.js')
const precommitRelativeUnixPath = path.relative(
  path.join(git, '..'),
  precommitPath
)
if (fs.existsSync(precommit) && !fs.lstatSync(precommit).isSymbolicLink()) {
  const body = fs.readFileSync(precommit)

  if (body.indexOf(precommitRelativeUnixPath) >= 0) {
    return
  } else {
    fs.writeFileSync(precommit + '.old', fs.readFileSync(precommit))
  }
}

// We cannot create a symlink over an existing file so make sure it's gone and
// finish the installation process.
try {
  fs.unlinkSync(precommit)
} catch (e) {}

const hook = path.join(__dirname, 'hook')
const hookRelativeUnixPath = path.relative(path.join(git, '..'), hook)

const precommitContent = `#!/usr/bin/env bash

set -e

if [[ -f "${hookRelativeUnixPath}" && -f "${precommitRelativeUnixPath}" ]]; then
  "${hookRelativeUnixPath}" "${precommitRelativeUnixPath}"
fi
`.replace('\n', os.EOL)

// It could be that we do not have rights to this folder which could cause the
// installation of this module to completely fail. We should just output the
// error instead destroying the whole npm install process.
try {
  fs.writeFileSync(precommit, precommitContent)
} catch (e) {
  console.error('Failed to create the hook file in your .git/hooks folder:')
  console.error(e.message)
}

try {
  fs.chmodSync(precommit, '774')
} catch (e) {
  console.error('Failed to chmod 0774 .git/hooks/pre-commit:')
  console.error(e.message)
}
