
import * as fs from 'fs-extra'
import * as archiver from 'archiver'
import * as glob from 'glob'

export function zip (file: string, patterns: string[], globOptions: glob.IOptions, format: archiver.Format = 'tar'): Promise<number> {
  let options: archiver.ArchiverOptions = format === 'zip' ?
    {
      zlib: {
        level: 9
      }
    } : {
      gzip: true,
      gzipOptions: {
        level: 9
      }
    }
  return new Promise((resolve, reject) => {
    let archive = archiver(format, options)
    let output: fs.WriteStream = fs.createWriteStream(file)
    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes')
      console.log('archiver has been finalized and the output file descriptor has closed.')
    })
    output.on('end', () => {
      console.log('Data has been drained')
    })
    archive.on('warning', err => {
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        reject(err)
      }
    })
    archive.on('error', err => {
      reject(err)
    })
    archive.on('end', () => {
      let archiveSize = archive.pointer()
      resolve(archiveSize)
    })
    archive.pipe(output)
    patterns.map( pattern => {
      archive.glob(pattern, globOptions)
    })
    archive.finalize()
  })
}