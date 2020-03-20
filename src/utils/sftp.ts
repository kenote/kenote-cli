import { Client, ScpOptions } from 'scp2'
import { isString } from 'lodash'
import { UploadFile } from '../../types/deploy'

export default class SFTP {

  private __Client: Client

  private __Options: ScpOptions

  constructor (options: ScpOptions) {
    this.__Options = options
  }

  public async connect (): Promise<void> {
    this.__Client = new Client(this.__Options)
    return new Promise((resolve, reject) => {
      this.__Client
        .on('ready', () => {
          console.log('')
          console.log('Sftp :: connect to %s', this.__Options.host, '\n')
        })
        .on('error', err => {
          reject(err)
        })
        .on('close', () => {
          
        })
        .sftp( (err, sftp) => {
          if (err) {
            reject(err)
          }
          else {
            resolve(sftp)
          }
        })
    })
  }

  public async upload (file: UploadFile): Promise<void> {
    return new Promise((resolve, reject) => {
      this.__Client.upload(file.filepath, file.dest, err => {
        if (err) {
          reject(isString(err) ? new Error(err) : err)
        }
        else {
          resolve(undefined)
        }
      })
    })
  }

  public end () {
    this.__Client.close()
  }
}