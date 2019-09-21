const fs = require('fs-extra')
const cp = require('child_process')
const tmp = require('tmp')
const path = require('path')
const os = require('os')

tmp.setGracefulCleanup()
var tmpdir = tmp.dirSync().name

function execSync (command, args) {
  return cp.execSync(command, {
    maxBuffer: 20 * 1024 * 1024,
    stdio: 'inherit',
    ...args
  })
}

it('works for js repository', () => {
  const cwd = tmpdir + '/sandbox'

  const version = require('../package.json').version

  execSync('npm pack', { cwd: process.cwd() })

  fs.removeSync(cwd)
  fs.mkdirpSync(cwd)
  execSync('git init', { cwd })
  fs.writeFileSync(
    tmpdir + '/sandbox/package.json',
    JSON.stringify(
      {
        name: 'foobar',
        devDependencies: {
          'modern-node':
            'file:' +
            path.resolve(__dirname, '..', 'modern-node-' + version + '.tgz')
        },
        scripts: {
          format: 'modern format',
          lint: 'modern lint',
          test: 'modern test',
          precommit: 'modern precommit'
        },
        'lint-staged': {
          '*.js': 'modern lint'
        }
      },
      null,
      2
    )
  )

  execSync('npm install', { cwd })
  execSync('npm run format', { cwd })
  execSync('ls -lah', { cwd })
  execSync('npm run lint', { cwd })
  execSync('echo "console.log(   12);" > index.js', { cwd })
  execSync('git add -A', { cwd })
  execSync('git commit -m test', { cwd })

  execSync('ls -lah 1>&2', { cwd })
  execSync('ls -lah 1>&2', { cwd: path.join(cwd, '.git/hooks') })
  execSync('cat pre-commit 1>&2', { cwd: path.join(cwd, '.git/hooks') })

  const contents = fs.readFileSync(cwd + '/index.js', 'utf-8')
  expect(contents).toEqual('console.log(12)' + os.EOL)
})
