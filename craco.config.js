const webpack = require('webpack')

// This is a working configuration for create-react-app 5 + CRACO (c-r-a-config-override) 6.4.4.
// It adds these things which are disabled by default in webpack 5:
// - webpack loader for wasm files
// - polyfill for "buffer"

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const wasmExtensionRegExp = /\.wasm$/
      webpackConfig.resolve.extensions.push('.wasm')
      webpackConfig.experiments = {
        asyncWebAssembly: false,
        lazyCompilation: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
        syncWebAssembly: true,
        topLevelAwait: true,
      }
      webpackConfig.resolve.fallback = {
        buffer: require.resolve('buffer/'),
      }
      webpackConfig.module.rules.forEach((rule) => {
        ;(rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.type === 'asset/resource') {
            oneOf.exclude.push(wasmExtensionRegExp)
          }
        })
      })
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      )

      return webpackConfig
    },
  },
}
