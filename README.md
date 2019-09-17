# ![Modern Node](http://i.imgur.com/PqQAqwO.png)

[![Unix CI](https://img.shields.io/travis/sheerun/modern-node/master.svg)](https://travis-ci.org/sheerun/modern-node)
[![Windows CI](https://img.shields.io/appveyor/ci/sheerun/modern-node/master.svg)](https://ci.appveyor.com/project/sheerun/modern-node)
[![Modern Node](https://img.shields.io/badge/modern-node-9BB48F.svg)](https://github.com/sheerun/modern-node)

> Pre-configured toolkit modern node modules

- 🃏 Testing with [Jest](https://facebook.github.io/jest/)
- 💅 Formatting with [prettier](https://prettier.io/)
- 🌟 Linting with [eslint](https://eslint.org/) configured on [standard](https://standardjs.com/) rules
- 🐶 Automatically runs `precommit` script from `package.json` from when committing code

## Installation (new projects)

```
yarn create modern-node my-module
```

> If you're using [npm](https://www.npmjs.com/): `npm init modern-node my-module`.

## Installation (existing projects)

```
yarn add --dev modern-node
```

> If you're using [npm](https://www.npmjs.com/): `npm install --save-dev modern-node`.


Now you add appropriate scripts to your `package.json`:

```
{
  "scripts": {
    "test": "modern test",
    "format": "modern format",
    "lint": "modern lint",
    "precommit": "modern precommit"
  }
}
```

Test your project (watch mode):

```
yarn test
```

Format all files in the project (add `--help` for more options)

```
yarn format             # format all files
yarn format --changed   # format only changed files
```

Format and files in the project (add `--help` for more options)

```
yarn lint             # lint all files
yarn lint --changed   # lint only changed files
```

## License

MIT
