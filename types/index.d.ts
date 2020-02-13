

export declare namespace Configuration {

  interface Example extends Record<'name' | 'value' | 'repository', string> {
    results      ?:  InstallResult[]
  }

  interface InstallResult {
    name          : string
    content       : string[]
  }
}

export interface Configuration {

  examples?: Configuration.Example[]
}

export declare namespace Project {

  interface Install {
    name          : string
    target        : string
    repository   ?: string
    author        : string
    installer     : string
    description   : string
    results      ?: Configuration.InstallResult[]
  }

  interface Paths {
    name          : string
    target        : string
    exists        : boolean
  }

  interface Package {
    name          : string
    description   : string
    author        : string
  }
}