import * as path from 'path'
import * as http from 'http'
import * as express from 'express'
import { __ROOTPATH } from './utils'
import * as address from 'address'
import chalk from 'chalk'

export default async (name: string, port: string) => {
  let PORT: number = Number(port) || 5055
  let rootPath: string = path.resolve(__ROOTPATH, name || '')
  let app: express.Application = express()
  app.use(express.static(rootPath))
  let ipAddress: string = address.ip()
  console.log(chalk.gray(`> Running project in ${rootPath}`))
  try {
    await new Promise((resolve, reject) => {
      http.createServer(app).listen(PORT, '0.0.0.0', () => {
        resolve(null)
      })
    })
    console.log(chalk.bold('\n  App running at:'))
    console.log('  - Local:  ', chalk.blue(`http://localhost:${PORT}`))
    console.log('  - Network:', chalk.blue(`http://${ipAddress}:${PORT}`))
    console.log('')
  } catch (error) {
    console.error(error.message)
  }
}