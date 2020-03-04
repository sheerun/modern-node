const execa = require('execa')
const readPkgUp = require('read-pkg-up')
const path = require('path')

let pkg
try {
  pkg = readPkgUp.sync({ normalize: false })
} catch (err) {
  if (err.code !== 'ENOENT') {
    throw err
  }
}

if (
  pkg &&
  pkg.packageJson &&
  pkg.packageJson.scripts &&
  pkg.packageJson.scripts.precommit
) {
  const script = pkg.packageJson.scripts.precommit

  try {
    execa.sync(script, {
      cwd: path.dirname(pkg.path),
      env: {},
      stdio: 'inherit',
      preferLocal: true,
      shell: true
    })
  } catch (e) {
    if (e.exitCode && e.exitCode > 0) {
      process.exit(e.exitCode)
    }
  }
}
