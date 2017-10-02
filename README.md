# ![Modern Node Boilerplate](http://i.imgur.com/PqQAqwO.png)

[![Unix CI](https://img.shields.io/travis/sheerun/modern-node/master.svg)](https://travis-ci.org/sheerun/modern-node)
[![Windows CI](https://img.shields.io/appveyor/ci/sheerun/modern-node/master.svg)](https://ci.appveyor.com/project/sheerun/modern-node)
[![Modern Node](https://img.shields.io/badge/modern-node-9BB48F.svg)](https://github.com/sheerun/modern-node)

> Boilerplate for modern node modules

- Monorepo approach with [Yarn workspaces](https://yarnpkg.com/en/docs/workspaces)
- Testing with [Jest](https://facebook.github.io/jest/) using [multirunner](https://facebook.github.io/jest/blog/2017/05/06/jest-20-delightful-testing-multi-project-runner.html)
- Formatting with [prettier-standard](https://github.com/sheerun/prettier-standard)
- Precompiling for publishing with [Babel](https://babeljs.io/) and [babel-preset-env](https://www.npmjs.com/package/babel-preset-env)

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

## Known issues

Due to [known bug](https://github.com/babel/babel-preset-env/issues/433), you need to build project two times before publication.

## License

MIT
