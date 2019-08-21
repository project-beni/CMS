import * as os from 'os'
import * as path from 'path'
import { Configuration } from 'webpack'
import { default as ForkTsCheckerWebpackPlugin } from 'fork-ts-checker-webpack-plugin'


// eslint-disable-next-line @typescript-eslint/no-var-requires
const threadLoader = require('thread-loader')

// @ts-ignore: Parameter '_' implicitly has an 'any' type
const config = (_, { mode }: { mode: string}) => {
  const productionMode = mode === 'production'
  const cpus = os.cpus().length
  const getCpuNum = (isProduction: typeof productionMode) => {
    if (isProduction) {
      return cpus > 2 ? cpus - 1 : 1
    }
    return cpus > 3 ? cpus - 2 : 1
  }
  const loaderWorkers = getCpuNum(productionMode)
  const forkTsCheckerWorkers = Math.max(1, cpus - loaderWorkers)
  const workerOptions = {
    workers: loaderWorkers,
    workerParallelJobs: 50,
    poolTimeout: 2000,
    poolParallelJobs: 50,
    name: 'js-pool',
  }
  threadLoader.warmup(workerOptions, ['babel-loader'])

  const baseConfig: Configuration = {
    entry: {
      index: path.join(__dirname, 'src', 'app.tsx'),
    },
    output: {
      filename: '[name].bundle.js',
      path: path.join(__dirname, 'docs'),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'thread-loader',
              options: workerOptions
            },
            {
              loader: 'babel-loader',
              options: {
                compact: productionMode,
                minified: productionMode,
                cacheDirectory: !productionMode
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        async: !productionMode,
        workers: forkTsCheckerWorkers,
        useTypescriptIncrementalApi: false,
      }),
    ]
  }

  const webpackConfig: Configuration = baseConfig

  return webpackConfig
}


export default config
