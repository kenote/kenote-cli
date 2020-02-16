import * as path from 'path'
import * as yaml from 'js-yaml'
import chalk from 'chalk'
import { getConfig, __ROOTPATH, isConfigFile, installConfigFile } from './utils'

export default async (name: string): Promise<void> => {
  let config = getConfig()
  if (!name) {
    console.log(yaml.dump(config))
    process.exit(0)
  }
  let confifFile: string = path.resolve(__ROOTPATH, name)
  if (!['.yml', '.yaml', '.json'].includes(path.extname(name)) || !isConfigFile(confifFile)) {
    console.warn(chalk.bold.yellow('Warnning:') , 'Please fill in the correct file path.')
    process.exit(0)
  }
  try {
    await installConfigFile(confifFile)
  } catch (error) {
    console.error(error.message)
  }
}