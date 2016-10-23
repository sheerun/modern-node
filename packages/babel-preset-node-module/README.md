# babel-preset-node-module

This package includes the Babel preset used by [Modern Node](https://github.com/sheerun/modern-node). It includes:

- [babel-preset-latest](https://babeljs.io/docs/plugins/preset-latest/) for production
- [babel-preset-env](https://github.com/babel/babel-preset-env) for testing (an "autoprefixer" for [babel-preset-latest](http://babeljs.io/docs/plugins/preset-latest/))
- [babel-preset-react](https://www.npmjs.com/package/babel-preset-react) (for JSX and [flow](https://flowtype.org/))
- [babel-plugin-transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) (`class { handleClick = () => { } }`)
- [babel-plugin-transform-object-rest-spread](https://babeljs.io/docs/plugins/transform-object-rest-spread/) (`let n = { x, y, ...z };`)

## Usage

After installing babel, you can install this package as a dependency:

```
npm install --save-dev babel-preset-node-module
```

And configure Babel to use it by editing `.babelrc`:

```js
{
  "presets": ["node-module"]
}
```

### Options

* `targets` - an object of browsers/environment versions to support.
* `browsers` (array/string) - an query to select browsers (ex: last 2 versions, > 5%).

See [babel-preset-env](https://github.com/babel/babel-preset-env/) for details description of these options.

It defaults to current node version in development and test environment. For production babel-preset-latest is used.

* `loose` (boolean) - Enable "loose" transformations
* `modules` - Enable transformation of ES6 module syntax to another module type (Enabled by default to `"commonjs"`).
  * Can be `false` to not transform modules, or one of `["amd", "umd", "systemjs", "commonjs"]`.
* `debug` (boolean) - `console.log` out the targets and plugins being

Example:

```js
{
  "presets": [
    ["node-module", {
      "targets": {
        "chrome": 52,
        "browsers": "last 2 safari versions"
      },
      "loose": true,
      "modules": false
    }]
  ]
}
```
