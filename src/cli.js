#!/usr/bin/env node

var fs = require('fs')
const execa = require('execa')
const path = require('path')
const babel = require('@babel/core')

const help = `Usage
  $ modern <command> <arguments>

Commands:
  $ test - test project using Jest
  $ format - format project with prettier-standard
  $ pre-commit - format and lint staged files`

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
    options.stdio = 'inherit'
  }

  try {
    return await execa(command, args, options)
  } catch (e) {
    const message = []

    if (e.code === 'ENOENT') {
      message.push('Binary not found: ' + command)
    }

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
    await tryExec('jest', argv.slice(1))
    return
  }

  if (argv[0] === 'format') {
    await tryExec('prettier-standard', ['**/*.js'])
    return
  }

  if (argv[0] === 'precommit') {
    await tryExec('lint-staged', [
      '-c',
      path.join(__dirname, 'config', 'lint-staged.json')
    ])
    return
  }

  if (argv[0] === '--help') {
    console.log(help)
    return
  }

  terminate(help)
}

main()
