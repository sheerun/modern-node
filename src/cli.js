#!/usr/bin/env node

const execa = require('execa')

const help = `
Usage
  $ modern <command> <arguments>

Commands:
  $ test        - jest
  $ format      - prettier-standard --format
  $ lint        - prettier-standard --lint
  $ precommit   - lint-staged
`

function terminate (message) {
  message = typeof message === 'string' ? message : message.join('\n')
  if (message.length > 0) {
    message = `${message}\n`
  }
  process.stderr.write(message)
  process.exit(1)
}

function tryExec (command, args, options) {
  options = options || {}

  options.stdio = 'inherit'
  options.preferLocal = true

  return execa(command, args, options)
}

async function main () {
  var argv = process.argv.slice(2)

  if (argv[0] === 'test') {
    await tryExec('jest', argv.slice(1))
    return
  }

  if (argv[0] === 'precommit') {
    await tryExec('lint-staged', argv.slice(1))
    return
  }

  if (argv[0] === 'format') {
    await tryExec('prettier-standard', ['--format'])
    return
  }

  if (argv[0] === 'lint') {
    await tryExec('prettier-standard', ['--format', '--lint'])
    return
  }

  if (argv[0] === '--help') {
    console.log(help)
    return
  }

  terminate(help)
}

main()
