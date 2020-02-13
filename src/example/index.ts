import * as inquirer from 'inquirer'
import { getProject, getConfig, getAuthor, downloadRepo, installPackage } from '../utils'
import { } from 'lodash'
import { oc } from 'ts-optchain'
import { Project } from '../../types'

export default async function (): Promise<void> {
  let options = inquirer.prompt([
    {
      type: 'list',
      name: 'update',
      message: ''
    }
  ])
}

/**
 * 创建一个项目
 * @param name string
 */
export const createApp = async (name?: string) => {
  try {
    let project: Project.Install = await initProject(name)
    await installExample(project)
  } catch (error) {
    console.log(error.message)
  }
}

/**
 * 初始化项目
 * @param name string
 */
async function initProject (name?: string): Promise<Project.Install> {
  let project = getProject(name)
  if (project.exists) {
    let actions = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Target directory ${project.target} already exists. Whether to overwrite`,
        default: false
      }
    ])
    if (!actions.overwrite) {
      process.exit(0)
    }
  }
  console.log('> Generating project in', project.target)
  let { examples } = getConfig()
  if (oc(examples)([]).length === 0) {
    throw new Error('Did not find any examples')
  }
  let options = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name',
      default: project.name
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description',
      default: 'Your Project\'s description.'
    },
    {
      type: 'list',
      name: 'example',
      message: 'Choose a custom example',
      choices: [ ...examples ]
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name',
      default: getAuthor()
    },
    {
      type: 'list',
      name: 'installer',
      message: 'Choose a package manager',
      choices: [ 'npm', 'yarn' ],
      default: 'npm'
    }
  ])
  let example = examples?.find( o => o.value === options.example )
  return { 
    name        : options.name,
    description : options.description,
    author      : options.author,
    installer   : options.installer,
    target      : project.target, 
    repository  : example?.repository,
    results     : example?.results
  }
}

/**
 * 安装实例
 * @param options 
 */
async function installExample (options: Project.Install) {
  let { name, description, author, installer, target, repository, results } = options
  if (!repository) {
    throw new Error('No repository address configuration found.')
  }
  await downloadRepo(repository, target, { name, description, author })
  await installPackage(target, installer, results)
}
