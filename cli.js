#!/usr/bin/env node

const execa = require('execa')
const path = require('path')

const help = `
Usage
  $ modern <command> <arguments>

Commands:
  $ test - test project using Jest
  $ format - format project with prettier-standard
  $ precommit - format, lint, and test staged files
`

async function main () {
  var argv = process.argv.slice(2)

  if (argv[0] === 'test') {
    await execa('jest', argv.slice(1), { stdio: 'inherit' })
    return
  }

  if (argv[0] === 'format') {
    await execa('prettier-standard', ['**/*.js'], { stdio: 'inherit' })
    return
  }

  if (argv[0] === 'precommit' || argv[0] === 'pre-commit') {
    await execa(
      'lint-staged',
      ['-c', path.join(__dirname, 'lint-staged.json')],
      { stdio: 'inherit' }
    )
    return
  }

  console.log(help)
  process.exit(1)
}

main()
