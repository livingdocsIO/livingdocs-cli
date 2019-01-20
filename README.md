livingdocs-cli
==============

Livingdocs Command Line Interface

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/livingdocs-cli.svg)](https://npmjs.org/package/livingdocs-cli)
[![Codecov](https://codecov.io/gh/livingdocsIO/livingdocs-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/livingdocsIO/livingdocs-cli)
[![Downloads/week](https://img.shields.io/npm/dw/livingdocs-cli.svg)](https://npmjs.org/package/livingdocs-cli)
[![License](https://img.shields.io/npm/l/livingdocs-cli.svg)](https://github.com/livingdocsIO/livingdocs-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g livingdocs-cli
$ livingdocs COMMAND
running command...
$ livingdocs (-v|--version|version)
livingdocs-cli/0.0.0 darwin-x64 node-v8.7.0
$ livingdocs --help [COMMAND]
USAGE
  $ livingdocs COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`livingdocs component-library:build`](#livingdocs-component-librarybuild)
* [`livingdocs component-library:download`](#livingdocs-component-librarydownload)
* [`livingdocs component-library:upload`](#livingdocs-component-libraryupload)
* [`livingdocs help [COMMAND]`](#livingdocs-help-command)

## `livingdocs component-library:build`

Build a Component Library JSON file

```
USAGE
  $ livingdocs component-library:build

OPTIONS
  -d, --dist=dist  [default: .cache] The folder where the output will be written.
                   Defaults to ".cache".

  -s, --src=src    The folder with your .html component templates
```

_See code: [src/commands/component-library/build.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v0.0.0/src/commands/component-library/build.js)_

## `livingdocs component-library:download`

Download the Component Library from your project

```
USAGE
  $ livingdocs component-library:download

OPTIONS
  -d, --dist=dist    The folder or filename where to download to.
  -h, --host=host    [default: http://localhost:9090] The livingdocs host.

  -t, --token=token  The Access Token to your project (needs write permission).
                     Can be set by the environment variable 'LI_TOKEN'.
```

_See code: [src/commands/component-library/download.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v0.0.0/src/commands/component-library/download.js)_

## `livingdocs component-library:upload`

Upload a Component Library to your project

```
USAGE
  $ livingdocs component-library:upload

OPTIONS
  -a, --assets=assets          The folder where you asset files are located.
  -c, --components=components  The folder with your .html component templates
  -h, --host=host              [default: http://localhost:9090] The livingdocs host.

  -t, --token=token            The Access Token to your project (needs write permission).
                               Can be set by the environment variable 'LI_TOKEN'.
```

_See code: [src/commands/component-library/upload.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v0.0.0/src/commands/component-library/upload.js)_

## `livingdocs help [COMMAND]`

display help for livingdocs

```
USAGE
  $ livingdocs help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_
<!-- commandsstop -->
