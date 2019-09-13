# ![Modern Node](http://i.imgur.com/PqQAqwO.png)

[![Unix CI](https://img.shields.io/travis/sheerun/modern-node/master.svg)](https://travis-ci.org/sheerun/modern-node)
[![Windows CI](https://img.shields.io/appveyor/ci/sheerun/modern-node/master.svg)](https://ci.appveyor.com/project/sheerun/modern-node)
[![Modern Node](https://img.shields.io/badge/modern-node-9BB48F.svg)](https://github.com/sheerun/modern-node)

> Pre-configured toolkit modern node modules

- 🃏 Testing with [Jest](https://facebook.github.io/jest/)
- 💅 Formatting with [prettier](https://prettier.io/)
- 🌟 Linting with [eslint](https://eslint.org/) configured on [standard](https://standardjs.com/) rules
- 🐶 Automatically runs `precommit` script from `package.json` from when committing code

## Installation

Install this module as development dependency:

```
npm install --save-dev modern-node
```

Now you add appropriate scripts to your `package.json`:

```
{
  "scripts": {
    "test": "modern test",
    "format": "modern format",
    "lint": "modern lint",
    "precommit": "lint-staged"
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

## License

MIT
