# kenote-cli

A personal command line tool.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Gratipay][licensed-image]][licensed-url]

## Engines

node >= 8.x.x

## Install

```bash
$ npm i -g kenote-cli
```

## Usage

```bash
$ kenote -h
Usage: kenote [command] [options]

Options:
  -V, --version               output the version number
  -p --port <port>            set http server port
  -t --tag <tag-name>         choose a script tag.
  -e --example <example-url>  use a git repository url
  -h, --help                  output usage information

Commands:
  create [options]            create a new project.
  config                      get or set your configuration.
  script|run [options]        run npm scripts of project.
  serve|http [options]        simple http service.
  deploy [options]            Deploy your service to the server.
```

## License

this repo is released under the [MIT License][licensed-url].

[npm-image]: https://img.shields.io/npm/v/kenote-cli.svg
[npm-url]: https://www.npmjs.com/package/kenote-cli
[downloads-image]: https://img.shields.io/npm/dm/kenote-cli.svg
[downloads-url]: https://www.npmjs.com/package/kenote-cli
[licensed-image]: https://img.shields.io/badge/license-MIT-blue.svg
[licensed-url]: https://github.com/kenote/kenote-cli/blob/master/LICENSE
