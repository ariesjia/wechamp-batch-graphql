const path = require('path')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const version = process.env.VERSION || require('../package.json').version

const resolve = _path => path.resolve(__dirname, '../', _path)

const configs = {
  dev: {
    input: resolve('src/index.js'),
    file: resolve('dist/batch-graphql.js'),
    format: 'es',
    env: 'development'
  },
  prod: {
    input: resolve('src/index.js'),
    file: resolve('dist/batch-graphql.min.js'),
    format: 'es',
    env: 'production'
  },
}

function genConfig (opts) {
  const config = {
    input: {
      input: opts.input,
      plugins: [
        babel({
          exclude: 'node_modules/**'
        }),
        replace({
          __VERSION__: version
        }),
        buble()
      ],
    },
    output: {
      file: opts.file,
      format: opts.format,
      name: 'BatchGraphql'
    }
  }

  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  return config
}

function mapValues (obj, fn) {
  const res = {}
  Object.keys(obj).forEach(key => {
    res[key] = fn(obj[key], key)
  })
  return res
}

module.exports = mapValues(configs, genConfig)