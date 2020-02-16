import * as path from 'path'
import * as yaml from 'js-yaml'
import * as fs from 'fs-extra'
import validator from 'validator'
import { Configuration, Project } from '../../types'
import * as downloaditRepo from 'download-git-repo'
import * as os from 'os'
import * as ora from 'ora'
import { unset } from 'lodash'
import * as ini from 'ini'
import * as runscript from 'runscript'
import chalk from 'chalk'

export const __HOMEPATH: string = os.homedir()
export const __ROOTPATH: string = process.cwd()
export const __KENOTE: string = path.resolve(__HOMEPATH, '.kenote')
export const __CONFIGFILE: string = path.resolve(__KENOTE, 'config.yml')
export const __CLI_DIR: string = path.resolve(__dirname, '../../')

/**
 * 获取项目路径信息
 * @param name string
 */
export function getProject (name?: string): Project.Paths {
  let target: string = path.resolve(__ROOTPATH, name || '')
  let exists: boolean = fs.existsSync(target)
  name = path.basename(target)
  if (/(\/|\\)/.test(name)) {
    name = path.basename(name)
  }
  return { name, target, exists }
}

/**
 * 获取配置
 */
export function getConfig (): Configuration {
  let defaultConfig: Record<string, any> = loadConfig(path.resolve(__CLI_DIR, 'config.yml'))
  let customConfig: Record<string, any> = loadConfig(__CONFIGFILE)
  return { ...defaultConfig, ...customConfig }
}

/**
 * 读取配置文件
 * @param file String
 */
export function loadConfig (file: string): Record<string, any> {
  let data: Record<string, any> = {}
  if (!isConfigFile(file)) return data
  let fileStr: string = fs.readFileSync(file, 'utf-8')
  if (validator.isJSON(fileStr)) {
    return JSON.parse(fileStr)
  }
  try {
    data = yaml.load(fileStr)
  } catch (error) {
    
  }
  return data
}

/**
 * 判断配置文件
 * @param file String
 */
export function isConfigFile (file: string): boolean {
  if (!fs.existsSync(file)) return false
  let stat: fs.Stats = fs.statSync(file)
  if (stat.isDirectory()) return false
  return true
}

/**
 * 安装配置文件
 * @param file string
 */
export async function installConfigFile (file: string): Promise<void> {
  let spinner = ora('Installing configuration ...').start()
  try {
    if (!fs.existsSync(__KENOTE)) fs.mkdirpSync(__KENOTE)
    let config: Record<string, any> = loadConfig(file)
    let configStr: string = yaml.dump(config)
    await fs.writeFile(__CONFIGFILE, configStr, 'utf-8')
    spinner.stop()
    spinner.succeed('Installing configuration complete.')
  } catch (error) {
    spinner.stop()
    spinner.fail(error.message)
  }
}

/**
 * 获取 Author 信息
 */
export function getAuthor (): string {
  let author: string = os.userInfo().username
  let gitConfigFile: string = path.resolve(__HOMEPATH, '.gitconfig')
  if (!isConfigFile(gitConfigFile)) {
    return author
  }
  try {
    let gitConfig: Record<string, any> = ini.parse(fs.readFileSync(gitConfigFile, 'utf-8'))
    if (gitConfig.user) {
      let userinfo: string[] = [ gitConfig.user.name ]
      if (gitConfig?.user?.email) {
        userinfo.push(`<${gitConfig.user.email}>`)
      }
      return userinfo.join(' ')
    }
  } catch (error) {
    
  }
  return author
}

/**
 * 下载远程存储库到指定目录
 * @param repo string
 * @param target string
 */
export async function downloadRepo (repo: string, target: string, options: Project.Package): Promise<void> {
  let spinner = ora('Downloading repo ...').start()
  try {
    await fs.remove(target)
    await new Promise((resolve, reject) => {
      downloaditRepo(repo, target, err => {
        if (err) return reject(err)
        resolve()
      })
    })
    spinner.stop()
    spinner.succeed('Downloading repo complete.')
    refreshPackageJson(options, target)
  } catch (error) {
    let message = error.message
    if (error.host && error.path) {
      message += '\n' + error.host + error.path
    }
    spinner.stop()
    spinner.fail(message)
  }
}

/**
 * 刷新 package.json
 * @param options Project.Package
 * @param target string
 */
function refreshPackageJson (options: Project.Package, target: string): void {
  let packageFile: string = path.resolve(target, 'package.json')
  let pkg: Record<string, any> = fs.readJsonSync(packageFile, { encoding: 'utf-8' })
  unset(pkg, 'repository')
  pkg = { ...pkg, ...options }
  fs.writeJsonSync(packageFile, pkg, { encoding: 'utf-8', replacer: null, spaces: 2 })
}

/**
 * 读取 package.json
 * @param target string
 */
export function readPackageJson (target?: string): Record<string, any> | undefined {
  if (!target) {
    target = __ROOTPATH
  }
  let packageFile: string = path.resolve(target, 'package.json')
  if (!isConfigFile(packageFile)) {
    return undefined
  }
  
  return loadConfig(packageFile) // fs.readJsonSync(packageFile, { encoding: 'utf-8' })
}

/**
 * 安装所需包
 * @param target string
 * @param installer 'npm' |'yarn'
 */
export async function installPackage (target: string, installer: string = 'npm', results?: Configuration.InstallResult[]): Promise<void> {
  let spinner = ora('Installing package ...\n').start()
  try {
    spinner.info('')
    await runscript(`${installer} install`, { cwd: target })
    spinner.stop()
    spinner.succeed('Installing package complete.')
    if (results) {
      for (let result of results) {
        console.log('\n ', chalk.bold(`${result.name}:`), '\n')
        if (__ROOTPATH !== target) {
          let dir: string = __ROOTPATH === path.dirname(target) ? path.basename(target) : target
          console.log('   ', chalk.blue('cd'), dir)
        }
        for (let line of result.content) {
          console.log('   ', line)
        }
      }
      console.log('')
    }
  } catch (error) {
    let message = error.message
    spinner.stop()
    spinner.fail(message)
  }
}
