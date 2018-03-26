# ![Modern Node Boilerplate](http://i.imgur.com/PqQAqwO.png)

[![Unix CI](https://img.shields.io/travis/sheerun/modern-node/master.svg)](https://travis-ci.org/sheerun/modern-node)
[![Windows CI](https://img.shields.io/appveyor/ci/sheerun/modern-node/master.svg)](https://ci.appveyor.com/project/sheerun/modern-node)
[![Modern Node](https://img.shields.io/badge/modern-node-9BB48F.svg)](https://github.com/sheerun/modern-node)

> Boilerplate for modern node modules

- Testing with [Jest](https://facebook.github.io/jest/) using [multirunner](https://facebook.github.io/jest/blog/2017/05/06/jest-20-delightful-testing-multi-project-runner.html)
- Formatting with [prettier](https://github.com/prettier/prettier) and [prettier-standard](https://github.com/sheerun/prettier-standard)
- Precompiling for publication with [Babel 7](https://babeljs.io/) and [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env)

## Installation

Install this module as development dependency"

```
npm install --save-dev modern-node
```

And add appropriate scripts to your `package.json`:

```
{
  "scripts": {
    "test": "modern test",
    "format": "modern format",
    "build": "modern build",
    "precommit": "modern precommit"
  }
}
```

Test your project:

```
yarn test
```

Pretty format your project:

```
yarn format
```

Prepare project for publication:

```
yarn build
```

Review and publish project:

```
cd package
npm publish
```


## License

MIT
