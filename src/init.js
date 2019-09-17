// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const execSync = require('child_process').execSync
const os = require('os')
const glob = require('fast-glob')
const camelcase = require('camelcase')
const username = require('username')
const execa = require('execa')

function isInGitRepository () {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

function isInMercurialRepository () {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

function fetchGitConfig () {
  try {
    const data = {}
    const out = execa.sync('git', ['config', '--get-regexp', 'user.'])
    out.stdout
      .trim()
      .split('\n')
      .forEach(line => {
        const key = line.split(' ')[0]
        const value = line.slice(key.length + 1)
        data[key] = value
      })
    return data
  } catch (e) {
    return {}
  }
}

function tryGitInit (appPath) {
  let didInit = false
  try {
    execSync('git --version', { stdio: 'ignore' })
    if (isInGitRepository() || isInMercurialRepository()) {
      return false
    }

    execSync('git init', { stdio: 'ignore' })
    didInit = true

    execSync('git add -A', { stdio: 'ignore' })
    execSync('git commit -m "Initial commit on master..."', {
      stdio: 'ignore'
    })
    return true
  } catch (e) {
    if (didInit) {
      // If we successfully initialized but couldn't commit,
      // maybe the commit author config is not set.
      // In the future, we might supply our own committer
      // like Ember CLI does, but for now, let's just
      // remove the Git files to avoid a half-done state.
      try {
        // unlinkSync() doesn't work on directories.
        fs.removeSync(path.join(appPath, '.git'))
      } catch (removeErr) {
        // Ignore.
      }
    }
    return false
  }
}

function replaceInFile (filename, process) {
  const data = fs.readFileSync(filename, 'utf8')
  const result = process(data)
  fs.writeFileSync(filename, result, 'utf8')
}

module.exports = function (
  appPath,
  appName,
  verbose,
  originalDirectory,
  template
) {
  const ownPath = path.dirname(
    require.resolve(path.join(__dirname, '..', 'package.json'))
  )
  const appPackage = require(path.join(appPath, 'package.json'))
  const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'))

  // Copy over some of the devDependencies
  const dependencies = appPackage.devDependencies || {}

  const useTypeScript = dependencies.typescript != null

  const user = username.sync()

  const gitConfig = fetchGitConfig()

  const devDependencies = appPackage.devDependencies
  delete appPackage.devDependencies

  appPackage.version = '0.0.0'

  if (gitConfig['user.name'] && gitConfig['user.email']) {
    appPackage.author = `${gitConfig['user.name']} <${gitConfig['user.email']}>`
  }

  if (user) {
    appPackage.repository = `${user}/${appPackage.name}`
  }

  appPackage.license = 'MIT'

  if (useTypeScript) {
    appPackage.main = 'lib/index.js'
    appPackage.files = ['lib']
  } else {
    appPackage.main = 'src/index.js'
    appPackage.files = ['src']
  }

  // Setup the script rules
  appPackage.scripts = {
    test: 'modern test',
    format: 'modern format',
    lint: 'modern lint',
    precommit: 'modern precommit'
  }

  if (useTypeScript) {
    appPackage['lint-staged'] = {
      '*.{js,ts}': ['modern lint', 'git add']
    }
  } else {
    appPackage['lint-staged'] = {
      '*.js': ['modern lint', 'git add']
    }
  }

  // Move devDependencies to the end
  appPackage.devDependencies = devDependencies

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  )

  const readmeExists = fs.existsSync(path.join(appPath, 'README.md'))
  if (readmeExists) {
    fs.renameSync(
      path.join(appPath, 'README.md'),
      path.join(appPath, 'README.old.md')
    )
  }

  // Copy the files for the user
  const templatePath = template
    ? path.resolve(originalDirectory, template)
    : path.join(ownPath, useTypeScript ? 'template-typescript' : 'template')
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath)
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    )
    return
  }

  glob.sync(['**/*.{md,js,ts}'], { cwd: appPath }).forEach(filename => {
    replaceInFile(path.join(appPath, filename), data =>
      data
        .replace(/{{jsName}}/g, camelcase(appPackage.name))
        .replace(/{{name}}/g, appPackage.name)
        .replace(/{{username}}/g, user)
    )
  })

  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  try {
    fs.moveSync(
      path.join(appPath, 'gitignore'),
      path.join(appPath, '.gitignore'),
      []
    )
  } catch (err) {
    // Append if there's already a `.gitignore` file there
    if (err.code === 'EEXIST') {
      const data = fs.readFileSync(path.join(appPath, 'gitignore'))
      fs.appendFileSync(path.join(appPath, '.gitignore'), data)
      fs.unlinkSync(path.join(appPath, 'gitignore'))
    } else {
      throw err
    }
  }

  if (tryGitInit(appPath)) {
    console.log()
    console.log('Initialized a git repository.')
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName
  } else {
    cdpath = appPath
  }

  // Change displayed command to yarn instead of yarnpkg
  const displayedCommand = useYarn ? 'yarn' : 'npm'

  console.log()
  console.log(`Success! Created ${appName} at ${appPath}`)
  console.log('Inside that directory, you can run several commands:')
  console.log()
  console.log(chalk.cyan(`  ${displayedCommand} format`))
  console.log('    Formats all files in repository.')
  console.log()
  console.log(chalk.cyan(`  ${displayedCommand} lint`))
  console.log('    Formats and lints all files in repository')
  console.log()
  console.log(chalk.cyan(`  ${displayedCommand} test`))
  console.log('    Runs all tests with Jest.')
  console.log()
  console.log()
  console.log('We suggest that you begin by typing:')
  console.log()
  console.log(chalk.cyan('  cd'), cdpath)
  console.log(`  ${chalk.cyan(`${displayedCommand} test`)}`)
  if (readmeExists) {
    console.log()
    console.log(
      chalk.yellow(
        'You had a `README.md` file, we renamed it to `README.old.md`'
      )
    )
  }
  console.log()
  console.log('Happy hacking!')
  console.log()
  console.log('btw. We are open to suggestions how to improve modern-node!')
  console.log(
    'Please submit an issue on https://github.com/sheerun/modern-node'
  )
}
