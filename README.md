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
$ livingdocs-cli COMMAND
running command...
$ livingdocs-cli (-v|--version|version)
livingdocs-cli/0.0.0 darwin-x64 node-v12.10.0
$ livingdocs-cli --help [COMMAND]
USAGE
  $ livingdocs-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`livingdocs-cli cli-config:print`](#livingdocs-cli-cli-configprint)
* [`livingdocs-cli component-library:build`](#livingdocs-cli-component-librarybuild)
* [`livingdocs-cli design-server:start`](#livingdocs-cli-design-serverstart)
* [`livingdocs-cli help [COMMAND]`](#livingdocs-cli-help-command)
* [`livingdocs-cli project-config:download`](#livingdocs-cli-project-configdownload)
* [`livingdocs-cli project-config:drafts`](#livingdocs-cli-project-configdrafts)
* [`livingdocs-cli project-config:plan`](#livingdocs-cli-project-configplan)
* [`livingdocs-cli project-config:publish`](#livingdocs-cli-project-configpublish)
* [`livingdocs-cli project-config:upload`](#livingdocs-cli-project-configupload)
* [`livingdocs-cli project-config:upload_assets`](#livingdocs-cli-project-configupload_assets)

## `livingdocs-cli cli-config:print`

Print current CLI configuration

```
USAGE
  $ livingdocs-cli cli-config:print
```

_See code: [src/commands/cli-config/print.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v0.0.0/src/commands/cli-config/print.js)_

## `livingdocs-cli component-library:build`

Build a Component Library JSON file

```
USAGE
  $ livingdocs-cli component-library:build

OPTIONS
  -d, --dist=dist  The folder where the output will be written.
  -s, --src=src    The folder with your .html component templates
```

_See code: [src/commands/component-library/build.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v0.0.0/src/commands/component-library/build.js)_

## `livingdocs-cli design-server:start`

Start a design server for development

```
USAGE
  $ livingdocs-cli design-server:start

OPTIONS
  -d, --dist=dist  (required) The folder to load designs from.
  -p, --port=port  [default: 9030] The port of the design-server.
  --assets=assets  Asset folder to serve static files.
  --verbose
```

_See code: [src/commands/design-server/start.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v0.0.0/src/commands/design-server/start.js)_

## `livingdocs-cli help [COMMAND]`

display help for livingdocs-cli

```
USAGE
  $ livingdocs-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `livingdocs-cli project-config:download`

Download a project configuration

```
USAGE
  $ livingdocs-cli project-config:download

OPTIONS
  -d, --dist=dist           The folder where the output will be written.

  -h, --host=host           [default: http://localhost:9090] The livingdocs host.
                            Can be set by the environment variable 'LI_HOST'.

  -t, --token=token         (required) The Access Token to your project (needs write permission).
                            Can be set by the environment variable 'LI_TOKEN'.

  --format=js|js/html|json  The format of the files written.
```

_See code: [src/commands/project-config/download.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v0.0.0/src/commands/project-config/download.js)_

## `livingdocs-cli project-config:drafts`

List project configuration drafts

```
USAGE
  $ livingdocs-cli project-config:drafts

OPTIONS
  -h, --host=host    [default: http://localhost:9090] The livingdocs host.
                     Can be set by the environment variable 'LI_HOST'.

  -t, --token=token  (required) The Access Token to your project (needs write permission).
                     Can be set by the environment variable 'LI_TOKEN'.
```

_See code: [src/commands/project-config/drafts.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v0.0.0/src/commands/project-config/drafts.js)_

## `livingdocs-cli project-config:plan`

See what would be updated in a publish command

```
USAGE
  $ livingdocs-cli project-config:plan

OPTIONS
  -d, --dist=dist    The folder or filename where to download to.

  -h, --host=host    [default: http://localhost:9090] The livingdocs host.
                     Can be set by the environment variable 'LI_HOST'.

  -t, --token=token  (required) The Access Token to your project (needs write permission).
                     Can be set by the environment variable 'LI_TOKEN'.
```

_See code: [src/commands/project-config/plan.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v0.0.0/src/commands/project-config/plan.js)_

## `livingdocs-cli project-config:publish`

Publish a ChannelConfig to your project

```
USAGE
  $ livingdocs-cli project-config:publish

OPTIONS
  -d, --dist=dist    The folder to publish from.

  -h, --host=host    [default: http://localhost:9090] The livingdocs host.
                     Can be set by the environment variable 'LI_HOST'.

  -t, --token=token  (required) The Access Token to your project (needs write permission).
                     Can be set by the environment variable 'LI_TOKEN'.
```

_See code: [src/commands/project-config/publish.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v0.0.0/src/commands/project-config/publish.js)_

## `livingdocs-cli project-config:upload`

Upload a ChannelConfig into a draft for your project

```
USAGE
  $ livingdocs-cli project-config:upload

OPTIONS
  -d, --dist=dist        The folder or filename where to download to.

  -h, --host=host        [default: http://localhost:9090] The livingdocs host.
                         Can be set by the environment variable 'LI_HOST'.

  -t, --token=token      (required) The Access Token to your project (needs write permission).
                         Can be set by the environment variable 'LI_TOKEN'.

  --draftName=draftName  (required) The name of the draft the config will be saved under.
```

_See code: [src/commands/project-config/upload.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v0.0.0/src/commands/project-config/upload.js)_

## `livingdocs-cli project-config:upload_assets`

Upload assets to your project

```
USAGE
  $ livingdocs-cli project-config:upload_assets

OPTIONS
  -a, --assets=assets  The folder where you asset files are located.

  -h, --host=host      [default: http://localhost:9090] The livingdocs host.
                       Can be set by the environment variable 'LI_HOST'.

  -t, --token=token    (required) The Access Token to your project (needs write permission).
                       Can be set by the environment variable 'LI_TOKEN'.
```

_See code: [src/commands/project-config/upload_assets.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v0.0.0/src/commands/project-config/upload_assets.js)_
<!-- commandsstop -->
