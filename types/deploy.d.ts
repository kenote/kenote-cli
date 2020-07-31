

export declare namespace Configuration {

  interface project {
    name               : string
    value              : string | number
    type               : 'ftp' | 'sftp'
    connect            : connect
    deployTo           : string
    rootDir           ?: string
    ignore            ?: readonly string[] | string
    rules             ?: Rule[]
    unzip             ?: boolean
    beforeScripts     ?: string[]
    remoteCommand     ?: string[]
  }

  interface connect {
    host               : string
    port               : number
    username           : string
    password          ?: string
    privateKey        ?: string
    secure            ?: boolean
  }
}

export interface DeployOptions {
  onlyCompress      ?: boolean
  nodeModules       ?: boolean
}

export interface Configuration {

  projects           : Configuration.project[]
}

export interface UploadFile {
  filename           : string
  filepath           : string
  dest               : string
}

export interface UploadOptions {
  workspace          : string
  deployTo           : string
  rules             ?: Rule[]
}

export interface Rule {
  test               : RegExp
  dest               : string
}