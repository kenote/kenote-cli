// Backpack Configuration file
const path = require('path')

module.exports = {
  webpack: (config, options, webpack) => {
    config.entry = {
      index: './src/index.ts'
    }
    config.plugins = [
      new webpack.DefinePlugin({
        'process.env.CLI_DIR': `"${__dirname}"`
      })
    ]

    config.resolve = {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        '@': __dirname,
        '~': path.join(__dirname, 'src')
      }
    }

    config.module.rules.push({
      test: /\.ts$/,
      loader: 'awesome-typescript-loader'
    })
    return config
  }
}