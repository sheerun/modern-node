# ![Modern Node Boilerplate](http://i.imgur.com/PqQAqwO.png)

[![Unix CI](https://img.shields.io/travis/sheerun/modern-node/master.svg)](https://travis-ci.org/sheerun/modern-node)
[![Windows CI](https://img.shields.io/appveyor/ci/sheerun/modern-node/master.svg)](https://ci.appveyor.com/project/sheerun/modern-node)
[![Modern Node](https://img.shields.io/badge/modern-node-9BB48F.svg)](https://github.com/sheerun/modern-node)

> Boilerplate for modern node modules

- Monorepo approach with [Yarn workspaces](https://yarnpkg.com/en/docs/workspaces)
- Testing with [Jest](https://facebook.github.io/jest/) using [multirunner](https://facebook.github.io/jest/blog/2017/05/06/jest-20-delightful-testing-multi-project-runner.html)
- Formatting with [prettier-standard](https://github.com/sheerun/prettier-standard)
- Command Line Interface with [meow](https://github.com/sindresorhus/meow)
- Precompiling for publishing with [Babel](https://babeljs.io/) and [babel-preset-node-module](https://www.npmjs.com/package/babel-preset-node-module)

## Development

Modern Node module is supposed to be developed on Node >= 8, but it can be deployed on any Node version, thanks to Babel precompilation.

## Usage

Install and link root project and all workspaces:

```
yarn
```

Test root project and all workspaces:

```
yarn test
```

Pretty format all workspaces:

```
yarn format
```

Way to publish workspace `foobar`:

```
yarn build
yarn test
cd projects/foobar
npm publish
```

## License

MIT
