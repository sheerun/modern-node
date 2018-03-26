#!/usr/bin/env node

const execa = require('execa')
const path = require('path')
const babel = require('@babel/core')
const babylon = require('babylon')
const pify = require('pify')
const find = pify(require('enfsfind').find)

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

    const json = JSON.parse(
      fs.readFileSync(path.join(packageDir, 'package.json'))
    )

    async function processFile(file) {
      const source = await fs.readFileAsync(file, 'utf-8')
      const firstLine = source.substr(0, source.indexOf('\n'))
      const ast = babylon.parse(source, {
        sourceType: 'module',
        allowReturnOutsideFunction: true
      })
      let { code } = babel.transformFromAst(ast, source, {
        babelrc: false,
        retainLines: true,
        sourceRoot: packageDir,
        filename: file,
        comments: false,
        presets: [
          [require.resolve('@babel/preset-env'), {
            "targets": {
              "node": "4"
            },
            "useBuiltIns": "usage"
          }]
        ]
      })

      if (firstLine.indexOf('#!') === 0) {
        code = code.replace(/^.*\n/, `${firstLine}\n`)
      }

      await fs.writeFileAsync(file, code)
    }
    const files = []
    const found = await find(packageDir, { filter: /\.js$/ })
    found.forEach(file => files.push(file.path))
    if (typeof json.bin === 'string') {
      if (files.indexOf(path.join(packageDir, json.bin)) === -1) {
        files.push(path.join(packageDir, json.bin))
      }
    } else if (typeof json.bin === 'object') {
      for (const key in json.bin) {
        if (files.indexOf(path.join(packageDir, json.bin[key])) === -1) {
          files.push(path.join(packageDir, json.bin[key]))
        }
      }
    }
    for (const file of files) {
      await processFile(file)
    }

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
