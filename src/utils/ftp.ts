import * as path from 'path'
import * as fs from 'fs-extra'
import * as ftp from 'basic-ftp'
import { UploadFile } from '../../types/deploy'

export default class FTP {

  private __Client: ftp.Client

  private __Options: ftp.AccessOptions

  constructor (options: ftp.AccessOptions) {
    this.__Options = options
    this.__Client = new ftp.Client()
  }

  public async connect (): Promise<void> {
    try {
      await this.__Client.access(this.__Options)
      console.log('')
      console.log('Ftp :: connect to %s', this.__Options.host)
    } catch (error) {
      this.__Client.close()
      throw error
    }
  }

  public async upload (file: UploadFile): Promise<void> {
    await this.__Client.ensureDir(path.dirname(file.dest))
    await this.__Client.uploadFrom(fs.createReadStream(file.filepath), file.dest)
  }

  public end (): void {
    this.__Client.close()
  }
}