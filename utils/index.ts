import * as path from 'path'
import * as yaml from 'js-yaml'
import * as fs from 'fs'
import { execSync } from 'child_process'

export const __HOMEPATH: string = process.env.HOME || `${process.env.HOMEDRIVE}${process.env.HOMEPATH}`
export const __ROOTPATH: string = process.cwd()
export const __KENOTE: string = path.resolve(__HOMEPATH, '.kenote')
export const __CONFIGFILE: string = path.resolve(__KENOTE, 'config.yml')

export function getProject (name: string) {
  let dir: string = path.resolve(__ROOTPATH, name)
  if (/(\/|\\)/.test(name)) {
    name = path.basename(name)
  }
  return [ name, dir ]
}


export function getConfig () {
  // let configFile: string = path.resolve(__KENOTE, 'config.yml')
  if (!fs.existsSync(__CONFIGFILE)) {
    // fs.copyFileSync()
  }
}