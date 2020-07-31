#!/usr/bin/env node
import * as path from 'path'
import * as program from 'commander'
import { isEmpty } from 'lodash'
import { createApp } from './project'
import scripts from './scripts'
import config from './config'
import serve from './serve'
import deploy from './deploy'
import { getArgs } from './utils'

const pkg = require('../package.json')
const basename = path.basename(process.env._ || process.title.replace(/^(\S+)(\s\-\s)(\S+)$/, '$3'))

program.version(pkg.version)

program
  .name(/^(node|backpack)$/.test(basename) ? 'kenote' : basename)
  .usage('[command] [options]')
  .option('-p --port <port>', 'set http server port')
  .option('-t --tag <tag-name>', 'choose a script tag.')

/**
 * 创建一个项目
 */
program
  .command('create')
  .usage('<app-name>')
  .description('create a new project.')
  .action( async () => {
    let [ name ] = program.args
    createApp(name)
  })

/**
 * 查看/编辑配置文件
 */
program
  .command('config')
  .usage('[filename]')
  .description('get or set your configuration.')
  .action( async () => {
    let [ name ] = program.args
    config(name)
  })

/**
 * 运行项目的npm脚本
 */
program
  .command('script')
  .alias('run')
  .usage('[path] [options]')
  .option('-t --tag <tag-name>', 'choose a script tag.')
  .option('--makefile', 'use Makefile.')
  .description('run npm scripts of project.')
  .action( () => {
    let [ name ] = program.args
    let { makefile } = getArgs(program.commands, ['makefile'])
    scripts(name, program.tag, makefile)
  })

/**
 * 简单HTTP服务
 */
program
  .command('serve')
  .alias('http')
  .usage('[path] [options]')
  .option('-p --port <port>', 'set http server port')
  .description('simple http service.')
  .action( () => {
    let [ name ] = program.args
    serve(name, program.port)
  })

/**
 * 部署服务
 */
program
  .command('deploy')
  .usage('[path] [options]')
  .option('--only-compress', 'only compress.')
  .option('--node-modules', 'contains the node_modules directory.')
  .description('Deploy your service to the server.')
  .action( () => {
    let [ name ] = program.args
    let { onlyCompress, nodeModules } = getArgs(program.commands, ['onlyCompress', 'nodeModules'])
    deploy(name, { onlyCompress, nodeModules })
  })

// Parse and fallback to help if no args
if (isEmpty(program.parse(process.argv).alias) && process.argv.length === 2) {
  program.help()
}
