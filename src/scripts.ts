import * as inquirer from 'inquirer'
import * as runscript from 'runscript'
import * as path from 'path'
import { oc } from 'ts-optchain'
import { readPackageJson, getProject, __ROOTPATH, readMakefileScripts } from './utils'

export default async (name: string, tag?: string, makefile?: boolean): Promise<void> => {
  let scripts: string[] = []
  if (makefile) {
    scripts = readMakefileScripts(name)
    if (scripts.length === 0) {
      console.log('No script command found, please check your Makefile.')
      process.exit(0)
    }
  }
  else {
    let pkg = readPackageJson(name)
    if (!oc(pkg).scripts()) {
      console.log('No script command found, please check your package.json file.')
      process.exit(0)
    }
    scripts = Object.keys(oc(pkg).scripts({}))
  }
  
  let project = getProject(name)
  console.log('> Where project on', project.target)
  try {
    let scriptTagname: string | undefined = tag
    if (!tag) {
      let options = await inquirer.prompt([
        {
          type: 'list',
          name: 'script',
          message: 'Choose a run script',
          choices: [ ...scripts ]
        }
      ])
      scriptTagname = options.script
    }
    let isScript: string | undefined = scripts.find( o => o === scriptTagname )
    if (!isScript) {
      let scriptFilename = makefile ? 'Makefile' : 'package.json file'
      console.log(`No script command found, please check your ${scriptFilename}.`)
      process.exit(0)
    }
    await runscript(`npm run ${scriptTagname}`, { cwd: path.resolve(__ROOTPATH, name??'' ) })
  } catch (error) {
    console.error(error.message)
  }
}