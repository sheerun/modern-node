![Modern Node Boilerplate](http://i.imgur.com/PqQAqwO.png)

[![Unix CI](https://img.shields.io/travis/sheerun/modern-node/master.svg)](https://travis-ci.org/sheerun/modern-node)
[![Windows CI](https://img.shields.io/appveyor/ci/sheerun/modern-node/master.svg)](https://ci.appveyor.com/project/sheerun/modern-node)
[![Modern Node](https://img.shields.io/badge/modern-node-9BB48F.svg)](https://github.com/sheerun/modern-node)

> Boilerplate for modern node modules

- Precompiling [Babel](https://babeljs.io/) with [react-app](https://github.com/facebookincubator/create-react-app/blob/master/packages/babel-preset-react-app/index.js) preset that includes:
  - [babel-preset-latest](https://babeljs.io/docs/plugins/preset-latest/) for production
  - [babel-preset-env](https://github.com/babel/babel-preset-env) for testing (an "autoprefixer" for [babel-preset-latest](http://babeljs.io/docs/plugins/preset-latest/))
  - [babel-preset-react](https://www.npmjs.com/package/babel-preset-react) (for JSX and [flow](https://flowtype.org/))
  - [babel-plugin-transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) (`class { handleClick = () => { } }`)
  - [babel-plugin-transform-object-rest-spread](https://babeljs.io/docs/plugins/transform-object-rest-spread/) (`let n = { x, y, ...z };`)


- Linting with [XO](https://github.com/sindresorhus/xo) configured to [JavaScript Standard Style](https://github.com/feross/standard)
- Testing with [AVA](https://github.com/avajs/ava)
- CLI interface with  [meow](https://github.com/sindresorhus/meow)
- Publishing with [np](https://github.com/sindresorhus/np)

## License

MIT
