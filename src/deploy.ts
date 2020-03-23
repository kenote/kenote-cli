import * as path from 'path'
import * as fs from 'fs-extra'
import * as glob from 'glob'
import * as async from 'async'
import * as dayjs from 'dayjs'
import * as runscript from 'runscript'
import * as inquirer from 'inquirer'
import * as chalk from 'chalk'
import FTP from './utils/ftp'
import SFTP from './utils/sftp'
import SSH from './utils/ssh'
import { __ROOTPATH, loadConfig } from './utils'
import { zip } from './utils/zip'
import { Configuration, UploadFile, UploadOptions, Rule } from '../types/deploy'

export default async (name: string) => {
  try {
    let { projects } = await getConfigFile(name) as Configuration
    if (projects?.length === 0) {
      console.log('Please configure a project first.')
      process.exit(0)
    }
    let project: Configuration.project
    if (projects.length === 1) {
      project = projects[0]
    }
    else {
      // 选择项目
      let selector = await inquirer.prompt([
        {
          type: 'list',
          name: 'project',
          message: 'Choose a project.',
          choices: [ ...projects ]
        }
      ])
      project = projects?.find( o => o.value === selector.project )??projects[0]
    }
    let { rootDir, ignore, rules, type, connect, deployTo, beforeScripts, remoteCommand, unzip } = parseProject(project)
    let workspace: string = path.resolve(__ROOTPATH, rootDir!)
    // 上传前运行本地脚本
    if (beforeScripts && beforeScripts.length > 0) {
      console.log('Start running pre-script ...\n')
      await runscript(beforeScripts.join(' && '))
    }
    // 上传文件队列 ...
    let { host, port, username, password, privateKey, secure } = connect as Configuration.connect
    let RemoteCommand: string[] = []
    let zipfileName: string = dayjs().format('YYYY-MM-DDTHHmmss') + '.tar.gz'
    let zipfile: string = path.resolve(__ROOTPATH, zipfileName)
    if (connect) {
      let globOptions: glob.IOptions = { cwd: workspace, nodir: true, realpath: true, ignore }
      let files = await pickFils(['**'], globOptions)
      let uploadFiles: UploadFile[] = processFiles(files, { workspace, deployTo, rules })
      if (unzip && type === 'sftp') {
        // 压缩上传文件
        console.log('\nStarting compressing folders ...')
        await zip(zipfile, '**', globOptions)
        uploadFiles = [{
          filename: `/${zipfileName}`,
          filepath: zipfile,
          dest: path.resolve(deployTo, zipfileName)
        }]
        RemoteCommand = [ `cd ${deployTo}`, `tar -zxvf ${zipfileName}`, `rm -rf ${zipfileName}` ].concat(remoteCommand??[])
      }
      let client = type === 'sftp'
        ? new SFTP({ host, port, username, password, privateKey })
        : new FTP({ host, port, user: username, password, secure })
      await client.connect()
      await upload(client, uploadFiles)
      console.log('')
      client.end()
    }
    // 上传后远端脚本
    if (RemoteCommand.length > 0 && type === 'sftp') {
      await new SSH({ host, port, username, password, privateKey }).exec(RemoteCommand.join(' && '))
      console.log('Command execution completed.\n')
      if (fs.existsSync(zipfile)) {
        fs.unlinkSync(zipfile)
      }
    }
  } catch (error) {
    console.error(error.message)
  }
}

/**
 * 获取配置文件
 * @param name string
 */
async function getConfigFile (name?: string): Promise<Record<string, any>> {
  if (!name) {
    let files: string[] = fs.readdirSync(__ROOTPATH)
    name = files.find( o => /^(deploy\.config)\.(ya?ml|json|js)$/.test(o))
  }
  let configFile: string = path.resolve(__ROOTPATH, name??'')
  if (!/\.(ya??ml|json|js)$/.test(name!) || !fs.existsSync(configFile)) {
    console.log('No configuration files found.')
    process.exit(0)
  }
  if (/\.(ya?ml|json)$/.test(name??'')) {
    return loadConfig(configFile)
  }
  return await import(configFile)
}

/**
 * 获取工作目录经过筛选的所有文件
 * @param patterns string[]
 * @param options glob.IOptions
 * @returns string[]
 */
async function pickFils (patterns: string[], options: glob.IOptions): Promise<string[]> {
  return new Promise((resolve, reject) => {
    async.map(
      patterns,
      (pattern, done) => {
        glob(pattern, options, done)
      },
      (err, results) => {
        if (err) {
          reject(err)
        }
        else {
          let files = (results??[]).reduce((files: string[], item: string[]) => files.concat(item) ) as string[]
          resolve(files)
        }
      }
    )
  })
}

/**
 * 处理上传队列
 * @param client SFTP | FTP
 * @param files UploadFile[]
 */
async function upload (client: FTP | SFTP, files: UploadFile[]): Promise<void> {
  if (files.length == 0) return
  let file = files.shift()
  if (file) {
    try {
      await client.upload(file)
      file && success(file)
      if (files.length > 0) {
        await upload(client, files)
      }
    } catch (error) {
      file && failure(file)
    }
  }
}

/**
 * 传输成功信息
 * @param file IDeploy.UploadFile
 */
function success (file: UploadFile): void {
  let desc: string = chalk.cyan(`${file.filename} ${chalk.white('===>')} ${file.dest}`)
  console.log(chalk.greenBright('upload success :'), desc)
}

/**
 * 传输失败信息
 * @param file UploadFile
 */
function failure (file: UploadFile): void {
  let desc: string = chalk.yellow(`${file.filename} ${chalk.white('===>')} ${file.dest}`)
  console.log(chalk.redBright('upload failure :'), desc)
}

/**
 * 转换上传文件列表格式
 * @param files string[]
 * @param options UploadOptions
 * @returns UploadFile[]
 */
function processFiles (files: string[], options: UploadOptions): UploadFile[] {
  let { workspace, deployTo, rules } = options
  return files.map( item => {
    let filename: string = item.replace(new RegExp(`^(${workspace})`), '')
    let filepath: string = item
    let dest: string = path.join(deployTo || '/home', filename)
    let file: UploadFile = { filename, filepath, dest }
    rules?.forEach( rule => {
      customDest(file, rule, deployTo)
    })
    return file
  })
}

/**
 * 处理自定义规则
 * @param file IDeploy.UploadFile
 * @param rule IDeploy.Rule
 * @param root string
 */
function customDest (file: UploadFile, rule: Rule, root: string = ''): void {
  let pattern: RegExp = rule.test
  let matched: RegExpMatchArray | null = file.filepath.match(pattern)
  if (matched) {
    file.dest = rule.dest.replace(/\[\$(\d+)\]/g, (m, idx) => (<RegExpMatchArray> matched)[idx] )
    file.dest = path.join(root || '/home', file.dest)
  }
}

function parseProject (project: Configuration.project): Configuration.project {
  let { type } = project
  let defaultPort: number = type === 'ftp' ? 21 : 22
  project.connect.port = project.connect.port??defaultPort
  if (type === 'ftp') {
    project.remoteCommand = undefined
  }
  return project
}