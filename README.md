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

## Usage

Test your project with Jest (watch mode):

```
modern test
```

Format all files in the project with [prettier-standard](https://github.com/sheerun/prettier-standard) (add `--help` for more options)

```
modern format             # format all files
modern format --changed   # format only changed files
modern format '**/*.js'   # format only selected
```

Format and files in the project (add `--help` for more options)

```
modern lint             # lint all files
modern lint --changed   # lint only changed files
modern lint '**/*.js'   # lint only selected files
```

Format and lint staged changes (useful to put into `precommit` script)

```
modern precommit
```

For now linted extensions can be configured with `lint-staged` option in `package.json`.

## License

MIT
