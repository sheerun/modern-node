const fs = require('fs-extra')
const execSync = require('child_process').execSync

execSync('yarn link')

console.log('Creating...')
fs.removeSync('test/sandbox')
fs.mkdirpSync('test/sandbox')
fs.writeFileSync(
  'test/sandbox/package.json',
  JSON.stringify(
    {
      name: 'foobar',
      devDependencies: {
        'modern-node': '*'
      }
    },
    null,
    2
  )
)

fs.removeSync('test/sandbox-ts')
fs.mkdirpSync('test/sandbox-ts')
fs.writeFileSync(
  'test/sandbox-ts/package.json',
  JSON.stringify(
    {
      name: 'foobar',
      devDependencies: {
        'modern-node': '*',
        typescript: '*'
      }
    },
    null,
    2
  )
)

function run (dir) {
  const path = require('path')
  const root = path.resolve(__dirname, '..', dir)
  const appName = 'sandbox'
  const verbose = false
  const originalDirectory = path.resolve(__dirname, '..')
  const template = null
  const data = [root, appName, verbose, originalDirectory, template]
  var init = require('../src/init.js')
  init.apply(null, data)
}

run('test/sandbox')
run('test/sandbox-ts')

console.log('Linking...')
execSync('yarn link modern-node', { cwd: 'test/sandbox' })
execSync('yarn link modern-node', { cwd: 'test/sandbox-ts' })

process.exit(0)
