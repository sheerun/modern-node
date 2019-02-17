# ![Modern Node Boilerplate](http://i.imgur.com/PqQAqwO.png)

[![Unix CI](https://img.shields.io/travis/sheerun/modern-node/master.svg)](https://travis-ci.org/sheerun/modern-node)
[![Windows CI](https://img.shields.io/appveyor/ci/sheerun/modern-node/master.svg)](https://ci.appveyor.com/project/sheerun/modern-node)
[![Modern Node](https://img.shields.io/badge/modern-node-9BB48F.svg)](https://github.com/sheerun/modern-node)

> Boilerplate for modern node modules

- Testing with [Jest](https://facebook.github.io/jest/)
- Formatting with [prettier](https://github.com/prettier/prettier)
- Pre-commit hook support with [husky](https://github.com/typicode/husky)
- Linting and formatting staged files with [lint-staged](https://github.com/okonet/lint-staged)

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
    "pre-commit": "modern pre-commit"
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

Review and publish project:

```
cd package
npm publish
```


## License

MIT
