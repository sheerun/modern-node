'use strict'

function buildPreset(context, opts) {
  opts = opts || {}

  var path = require('path')

  var plugins = [
      // class { handleClick = () => { } }
    require.resolve('babel-plugin-transform-class-properties'),
      // { ...todo, completed: true }
    require.resolve('babel-plugin-transform-object-rest-spread'),
      // function* () { yield 42; yield 43; }
      [require.resolve('babel-plugin-transform-regenerator'), {
        // Async functions are converted to generators by babel-preset-latest
        async: false
      }],
      // Polyfills the runtime needed for async/await and generators
      [require.resolve('babel-plugin-transform-runtime'), {
        helpers: true,
        polyfill: true,
        regenerator: true,
        // Resolve the Babel runtime relative to the config.
        moduleName: path.dirname(require.resolve('babel-runtime/package'))
      }]
  ]

  // This is similar to how `env` works in Babel:
  // https://babeljs.io/docs/usage/babelrc/#env-option
  // We are not using `env` because it’s ignored in versions > babel-core@6.10.4:
  // https://github.com/babel/babel/issues/4539
  // https://github.com/facebookincubator/create-react-app/issues/720
  // It’s also nice that we can enforce `NODE_ENV` being specified.
  var env = process.env.BABEL_ENV || process.env.NODE_ENV
  if (env !== 'development' && env !== 'test' && env !== 'production') {
    throw new Error(
      'Using `babel-preset-react-app` requires that you specify `NODE_ENV` or ' +
      '`BABEL_ENV` environment variables. Valid values are "development", ' +
      '"test", and "production". Instead, received: ' + JSON.stringify(env) + '.'
    )
  }

  if (env === 'development' || env === 'test') {
    plugins.push([
      // Adds component stack to warning messages
      require.resolve('babel-plugin-transform-react-jsx-source'),
      // Adds __self attribute to JSX which React will use for some warnings
      require.resolve('babel-plugin-transform-react-jsx-self')
    ])
  }

  if (env === 'development' || env === 'test') {
    return {
      presets: [
        // ES features necessary for user's Node version
        [require('babel-preset-env').default, {
          targets: opts.targets || {
            node: parseFloat(process.versions.node)
          },
          modules: opts.modules,
          loose: opts.loose,
          debug: opts.debug
        }],
        // JSX, Flow
        require.resolve('babel-preset-react')
      ],
      plugins: plugins
    }
  }

  return {
    presets: [
      // Latest stable ECMAScript features
      require.resolve('babel-preset-latest'),
      // JSX, Flow
      require.resolve('babel-preset-react')
    ],
    plugins: plugins
  }
}

module.exports = buildPreset
