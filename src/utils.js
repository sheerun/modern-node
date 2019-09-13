const path = require('path')
const fs = require('fs')
const findUp = require('find-up')

function getGitFolderPath (root) {
  let git = findUp.sync('.git', { type: 'directory', cwd: root })

  // Resolve git directory for submodules
  if (fs.existsSync(git) && fs.lstatSync(git).isFile()) {
    const gitinfo = fs.readFileSync(git).toString()
    const gitdirmatch = /gitdir: (.+)/.exec(gitinfo)
    const gitdir = gitdirmatch.length === 2 ? gitdirmatch[1] : null

    if (gitdir !== null) {
      git = path.join(root, gitdir)
    }
  }

  return git
}

module.exports = {
  getGitFolderPath
}
