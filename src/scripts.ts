import * as inquirer from 'inquirer'
import * as runscript from 'runscript'
import { oc } from 'ts-optchain'
import { readPackageJson, getProject } from './utils'

export default async (): Promise<void> => {
  let pkg = readPackageJson()
  if (!oc(pkg).scripts()) {
    console.log('No script command found, please check your package.json file.')
    process.exit(0)
  }
  let project = getProject()
  console.log('> Where project on', project.target)
  let scripts = Object.keys(oc(pkg).scripts({}))
  try {
    let options = await inquirer.prompt([
      {
        type: 'list',
        name: 'script',
        message: 'Choose a run script',
        choices: [ ...scripts ]
      }
    ])
    await runscript(`npm run ${options.script}`)
  } catch (error) {
    console.error(error.message)
  }
  
}