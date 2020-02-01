import * as path from 'path'
import * as inquirer from 'inquirer'
import { __HOMEPATH, __ROOTPATH, __KENOTE, getProject } from '@/utils'

const examples = [
  {
    name: 'vue-component-example',
    repository: 'https://github.com/kenote/vue-component-example',
    message: ''
  }
]

export default async function (): Promise<void> {
  let options = inquirer.prompt([
    {
      type: 'list',
      name: 'update',
      message: ''
    }
  ])
}

export const createApp = async (name: string) => {
  console.log('name:', name)
  console.log('home:', __HOMEPATH)
  console.log('root:', __ROOTPATH)
  console.log('kenote:', __KENOTE)
  let [ project_name, project_dir ] = getProject(name)
  console.log('project_name:', project_name)
  console.log('project_dir:', project_dir)
  console.log('cli_dir:', process.env.CLI_DIR)
  // let options = inquirer.prompt([
  //   {
  //     type: 'input',
  //     name: 'name',
  //     message: 'Project name'
  //   }
  //   // {
  //   //   type: 'list',
  //   //   name: 'example',
  //   //   message: ''
  //   // }
  // ])
  // console.log(options)
}

/**
 * 
 */