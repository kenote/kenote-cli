import * as path from 'path'
import * as program from 'commander'
import * as pkg from '@/package.json'
import { isEmpty } from 'lodash'
import { createApp } from './example'

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
  // .option('-e --example <example-name>')
  .description('create a new project.')
  .action( async () => {
    // createApp()
    let [ name ] = program.args
    // console.log(name, process.cwd())
    // if (!name) return program.help()
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
