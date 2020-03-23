import { Client, ConnectConfig } from 'ssh2'
import * as chalk from 'chalk'

export default class SSH {

  private __Options: ConnectConfig

  constructor (options: ConnectConfig) {
    this.__Options = options
  }

  public async exec (command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let client: Client = new Client()
      client
        .on('ready', () => {
          console.log('Ssh :: connect to %s', this.__Options.host)
          console.log('')
          console.log('Execute command line commands ...')
          console.log('')
          console.log(command)
          console.log('')
          client.exec(command, (err, stream) => {
            if (err) throw err
            stream
              ?.on('close', (code, signal) => client.end())
              .on('data', data => console.log(chalk.greenBright(data.toString())))
              .stderr.on('data', (data: Buffer) => console.log('STDERR:', data.toString()))
          })
        })
        .on('error', err => reject(err))
        .on('close', hadError => resolve(undefined))
        .connect(this.__Options)
    })
  }
}