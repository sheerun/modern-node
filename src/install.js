const fs = require('fs')
const path = require('path')
const os = require('os')
const hook = path.join(__dirname, 'hook')
const precommitPath = path.join(__dirname, 'precommit.js')
const root = path.resolve(__dirname, '..')
const env = process.env
const readPkgUp = require('read-pkg-up')

const isCi =
  env.CI || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, dsari
  env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
  env.BUILD_NUMBER || // Jenkins, TeamCity
  env.RUN_ID

// Don't run on CI
if (isCi) {
  return
}

// Create generic precommit hook that launches this modules hook (as well
// as stashing - unstashing the unstaged changes)
// TODO: we could keep launching the old pre-commit scripts
var hookRelativeUnixPath = hook.replace(root, '.')
var precommitRelativeUnixPath = precommitPath.replace(root, '.')

//
// Gather the location of the possible hidden .git directory, the hooks
// directory which contains all git hooks and the absolute location of the
// `pre-commit` file. The path needs to be absolute in order for the symlinking
// to work correctly.
//

var git = getGitFolderPath(root)

// Function to recursively finding .git folder
function getGitFolderPath (currentPath) {
  var git = path.resolve(currentPath, '.git')

  if (!fs.existsSync(git) || !fs.lstatSync(git).isDirectory()) {
    var newPath = path.resolve(currentPath, '..')

    // Stop if we on top folder
    if (currentPath === newPath) {
      return null
    }

    return getGitFolderPath(newPath)
  }

  return git
}

//
// Resolve git directory for submodules
//
if (fs.existsSync(git) && fs.lstatSync(git).isFile()) {
  var gitinfo = fs.readFileSync(git).toString(),
    gitdirmatch = /gitdir: (.+)/.exec(gitinfo),
    gitdir = gitdirmatch.length == 2 ? gitdirmatch[1] : null

  if (gitdir !== null) {
    git = path.join(root, gitdir)
    hooks = path.join(git, 'hooks')
    precommit = path.join(hooks, 'pre-commit')
  }
}

//
// Bail out if we don't have an `.git` directory as the hooks will not get
// triggered. If we do have directory create a hooks folder if it doesn't exist.
//
if (!git) {
  console.warn('Not found any .git folder for installing pre-commit hook')
  console.warn(
    'Please install modern-node again after initializing repository'
  )
  return
}

let pkg
try {
  const result = readPkgUp.sync({ cwd: path.dirname(git), normalize: false })
  if (result) {
    pkg = result.package
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

if (pkg['precommit']) {
  console.warn('package.json: Please move precommit field to scripts.precommit')
}

if (pkg.husky && pkg.husky.hooks && pkg.husky['pre-commit']) {
  console.warn(
    'package.json: Please move husky.hooks.pre-commit to scripts.precommit'
  )
}

let hooks = path.join(git, 'hooks')
let precommit = path.join(hooks, 'pre-commit')

if (!fs.existsSync(hooks)) fs.mkdirSync(hooks)

//
// If there's an existing `pre-commit` hook we want to back it up instead of
// overriding it and losing it completely as it might contain something
// important.
//
if (fs.existsSync(precommit) && !fs.lstatSync(precommit).isSymbolicLink()) {
  const body = fs.readFileSync(precommit)

  if (body.indexOf(precommitRelativeUnixPath) >= 0) {
    return
  } else {
    fs.writeFileSync(precommit + '.old', fs.readFileSync(precommit))
  }
}

//
// We cannot create a symlink over an existing file so make sure it's gone and
// finish the installation process.
//
try {
  fs.unlinkSync(precommit)
} catch (e) {}

if (os.platform() === 'win32') {
  hookRelativeUnixPath = hookRelativeUnixPath.replace(/[\\\/]+/g, '/')
}

var precommitContent =
  '#!/usr/bin/env bash' +
  os.EOL +
  '[ -f "' + hookRelativeUnixPath + '" ] && ' +
  hookRelativeUnixPath +
  ' ' +
  precommitRelativeUnixPath +
  os.EOL +
  'RESULT=$?' +
  os.EOL +
  '[ $RESULT -ne 0 ] && exit 1' +
  os.EOL +
  'exit 0' +
  os.EOL

//
// It could be that we do not have rights to this folder which could cause the
// installation of this module to completely fail. We should just output the
// error instead destroying the whole npm install process.
//
try {
  fs.writeFileSync(precommit, precommitContent)
} catch (e) {
  console.error('Failed to create the hook file in your .git/hooks folder:')
  console.error(e.message)
}

try {
  fs.chmodSync(precommit, '777')
} catch (e) {
  console.error('Failed to chmod 0777 .git/hooks/pre-commit:')
  console.error(e.message)
}
