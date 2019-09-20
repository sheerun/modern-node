const fs = require('fs-extra')
const cp = require('child_process')
const os = require('os')

function execSync (command, args) {
  return cp.execSync(command, { maxBuffer: 10 * 1024 * 1024, ...args })
}

it('works for js repository', () => {
  console.log('Creating...')
  fs.removeSync('test/sandbox')
  fs.mkdirpSync('test/sandbox')
  execSync('git init', { cwd: 'test/sandbox' })
  fs.writeFileSync(
    'test/sandbox/package.json',
    JSON.stringify(
      {
        name: 'foobar',
        devDependencies: {
          'modern-node': 'file:../..'
        },
        scripts: {
          format: 'modern format',
          lint: 'modern lint',
          test: 'modern test',
          precommit: 'modern precommit'
        }
      },
      null,
      2
    )
  )

  execSync('yarn', { cwd: 'test/sandbox' })
  execSync('yarn format', { cwd: 'test/sandbox' })
  execSync('yarn lint', { cwd: 'test/sandbox' })
  execSync('echo "console.log(   12);" > index.js', { cwd: 'test/sandbox' })
  execSync('git add -A', { cwd: 'test/sandbox' })
  execSync('git commit -m test --author "User <user@example.com>"', {
    cwd: 'test/sandbox'
  })

  const contents = fs.readFileSync('test/sandbox/index.js', 'utf-8')
  expect(contents).toEqual('console.log(12)' + os.EOL)
})
