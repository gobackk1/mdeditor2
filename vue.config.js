const TypedocWebpackPlugin = require('typedoc-webpack-plugin')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import '@/sass/style.scss';`,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new TypedocWebpackPlugin(
        {
          mode: 'file',
        },
        './src/'
      ),
    ],
  },
  // publicPath: '/public'
}
