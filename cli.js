#!/usr/bin/env node

const execa = require('execa')
const path = require('path')

const help = `Usage
  $ modern <command> <arguments>

Commands:
  $ test - test project using Jest
  $ format - format project with prettier-standard
  $ precommit - format, lint, and test staged files`

function terminate (message) {
  message = typeof message === 'string' ? message : message.join('\n')
  if (message.length > 0) {
    message = `${message}\n`
  }
  process.stderr.write(message)
  process.exit(1)
}

async function tryExec (command, args, options) {
  options = options || {}

  if (!options.stdio) {
    options.stdio = 'pipe'
  }

  try {
    return await execa(command, args, options)
  } catch (e) {
    const message = []

    if (e.stdout) {
      message.push(e.stdout)
    }

    if (e.stderr) {
      message.push(e.stderr)
    }

    terminate(message.join('\n'))

    // To make flow happy
    return { stdout: '', stderr: '' }
  }
}

async function main () {
  var argv = process.argv.slice(2)

  if (argv[0] === 'test') {
    await tryExec('jest', argv.slice(1), { stdio: 'inherit' })
    return
  }

  if (argv[0] === 'format') {
    await tryExec('prettier-standard', ['**/*.js'], { stdio: 'inherit' })
    return
  }

  if (argv[0] === 'precommit' || argv[0] === 'pre-commit') {
    await tryExec(
      'lint-staged',
      ['-c', path.join(__dirname, 'lint-staged.json')],
      { stdio: 'inherit' }
    )
    return
  }

  if (argv[0] === '--help') {
    console.log(help)
    return
  }

  if (argv[0] === 'build') {
    const tar = require('tar')
    const fs = require('fs-extra-promise')
    const packageDir = path.join(process.cwd(), 'package')
    if (fs.existsSync(packageDir)) {
      await fs.removeAsync(packageDir)
    }
    const pkgName = (await tryExec('npm', ['pack'])).stdout
    const pkgPath = path.resolve(process.cwd(), pkgName.trim())
    try {
      await tar.x({ file: pkgPath, cwd: process.cwd() })
    } finally {
      await fs.removeAsync(pkgPath)
    }
    await tryExec('babel', ['package', '--out-dir', 'package'])
    const json = JSON.parse(
      fs.readFileSync(path.join(packageDir, 'package.json'))
    )
    if (!json.dependencies) {
      json.dependencies = {}
    }
    json.dependencies['core-js'] = '^2.5.3'
    json.dependencies['regenerator-runtime'] = '^0.11.1'
    await fs.writeJson(path.resolve(packageDir, 'package.json'), json)
    await tryExec('npm', ['install', '--production', '--ignore-scripts'], {
      cwd: packageDir,
      stdio: 'inherit'
    })

    return
  }

  terminate(help)
}

main()
