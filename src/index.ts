#!/usr/bin/env node
import * as path from 'path'
import * as program from 'commander'
import { isEmpty } from 'lodash'
import { createApp } from './example'

const pkg = require('../package.json')
const basename = path.basename(process.env._ || process.title.replace(/^(\S+)(\s\-\s)(\S+)$/, '$3'))

program.version(pkg.version)

program
  .name(/^(node|backpack)$/.test(basename) ? 'kenote' : basename)
  .usage('[command] [options]')

/**
 * 创建一个项目
 */
program
  .command('create')
  .usage('<app-name>')
  // .option('-e --example <example-name>')
  .description('create a new project.')
  .action( async () => {
    let [ name ] = program.args
    createApp(name)
  })

/**
 * 管理你的例子
 */
program
  .command('example')
  .description('manage your example.')
  .action( () => {

  })

// Parse and fallback to help if no args
if (isEmpty(program.parse(process.argv).alias) && process.argv.length === 2) {
  program.help()
}
