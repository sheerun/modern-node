#!/usr/bin/env node

var currentNodeVersion = process.versions.node
var semver = currentNodeVersion.split('.')
var major = semver[0]

if (major < 8) {
  console.error(
    'You are running Node ' +
      currentNodeVersion +
      '.\n' +
      'Create Modern Node requires Node 8 or higher. \n' +
      'Please update your version of Node.'
  )
  process.exit(1)
}

require('./index')
