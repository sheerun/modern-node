# babel-preset-modern-node

This package includes the Babel preset used by [Modern Node](https://github.com/sheerun/modern-node). It includes:

- [babel-preset-latest](https://babeljs.io/docs/plugins/preset-latest/) for production
- [babel-preset-env](https://github.com/babel/babel-preset-env) for testing (an "autoprefixer" for [babel-preset-latest](http://babeljs.io/docs/plugins/preset-latest/))
- [babel-preset-react](https://www.npmjs.com/package/babel-preset-react) (for JSX and [flow](https://flowtype.org/))
- [babel-plugin-transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) (`class { handleClick = () => { } }`)
- [babel-plugin-transform-object-rest-spread](https://babeljs.io/docs/plugins/transform-object-rest-spread/) (`let n = { x, y, ...z };`)

## Usage

After installing babel, you can install this package as a dependency:

```
npm install --save-dev babel-preset-modern-node
```

And configure Babel to use it by editing `.babelrc`:

```js
{
  "presets": ["modern-node"]
}
```
