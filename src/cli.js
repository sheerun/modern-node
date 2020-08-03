#!/usr/bin/env node

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

const execa = require('execa')

const help = `
Usage
  $ modern <command> <arguments>

Commands:
  $ test        - jest
  $ format      - prettier-standard
  $ lint        - prettier-standard --lint
  $ precommit   - prettier-standard --lint --staged
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

  try {
    return execa.sync(command, args, options)
  } catch (e) {
    process.exit(e.exitCode || 1)
  }
}

async function main () {
  var argv = process.argv.slice(2)

  if (argv[0] === 'test') {
    require('./test')
    return
  }

  if (argv[0] === 'precommit') {
    await tryExec(
      'prettier-standard',
      ['--lint', '--staged'].concat(argv.slice(1))
    )
    return
  }

  if (argv[0] === 'format') {
    await tryExec('prettier-standard', [].concat(argv.slice(1)))
    return
  }

  if (argv[0] === 'lint') {
    await tryExec('prettier-standard', ['--lint'].concat(argv.slice(1)))
    return
  }

  if (argv[0] === '--help') {
    console.log(help)
    return
  }

  terminate(help)
}

main()
