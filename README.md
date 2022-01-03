[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/livingdocs-cli.svg)](https://npmjs.org/package/livingdocs-cli)
[![Downloads/week](https://img.shields.io/npm/dw/livingdocs-cli.svg)](https://npmjs.org/package/livingdocs-cli)
[![License](https://img.shields.io/npm/l/livingdocs-cli.svg)](https://github.com/livingdocsIO/livingdocs-cli/blob/master/package.json)

# livingdocs-cli

Livingdocs Command Line Interface

## Setup

```sh-session
$ npm install -g livingdocs-cli
$ livingdocs-cli --help
```

# Commands Reference
<!-- commands -->
* [`livingdocs-cli component-library:build`](#livingdocs-cli-component-librarybuild)
* [`livingdocs-cli config:print`](#livingdocs-cli-configprint)
* [`livingdocs-cli design-server:start`](#livingdocs-cli-design-serverstart)
* [`livingdocs-cli help [COMMAND]`](#livingdocs-cli-help-command)
* [`livingdocs-cli project-config:download`](#livingdocs-cli-project-configdownload)
* [`livingdocs-cli project-config:import-design`](#livingdocs-cli-project-configimport-design)
* [`livingdocs-cli project-config:plan`](#livingdocs-cli-project-configplan)
* [`livingdocs-cli project-config:publish`](#livingdocs-cli-project-configpublish)

## `livingdocs-cli component-library:build`

Build a Component Library JSON file

```
USAGE
  $ livingdocs-cli component-library:build

OPTIONS
  -d, --dist=dist  The folder where the output will be written.
  -s, --src=src    The folder with your .html component templates
```

_See code: [src/commands/component-library/build.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v2.0.0/src/commands/component-library/build.js)_

## `livingdocs-cli config:print`

Print current CLI configuration

```
USAGE
  $ livingdocs-cli config:print

OPTIONS
  -e, --env=env          If used configuration options are loaded from .livingdocs-cli file.
  -p, --project=project  If used configuration options are loaded from .livingdocs-cli file.
```

_See code: [src/commands/config/print.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v2.0.0/src/commands/config/print.js)_

## `livingdocs-cli design-server:start`

Start a design server for development

```
USAGE
  $ livingdocs-cli design-server:start

OPTIONS
  -d, --dist=dist      (required) The folder to load designs from.
  -p, --port=port      [default: 9030] The port of the design-server.
  --assets=assets      Asset folder to serve static files.
  --basePath=basePath  The basePath to set in `assets.basePath`.
  --verbose
```

_See code: [src/commands/design-server/start.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v2.0.0/src/commands/design-server/start.js)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `livingdocs-cli project-config:download`

Download a project configuration

```
USAGE
  $ livingdocs-cli project-config:download

OPTIONS
  -d, --dist=dist           The folder where the output will be written.
  -e, --env=env             If used configuration options are loaded from .livingdocs-cli file.

  -h, --host=host           (required) [default: http://localhost:9090] The livingdocs host.
                            Can be set by the environment variable 'LI_HOST'.

  -p, --project=project     If used configuration options are loaded from .livingdocs-cli file.

  -t, --token=token         (required) Access Token for your project (needs `public-api:config:read` permission).
                            Can be set by the environment variable 'LI_TOKEN'.

  --format=js|js/html|json  The format of the files written.
```

_See code: [src/commands/project-config/download.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v2.0.0/src/commands/project-config/download.js)_

## `livingdocs-cli project-config:import-design`

Import a design into a given project configuration

```
USAGE
  $ livingdocs-cli project-config:import-design

OPTIONS
  -d, --dist=dist            (required) The folder where the output will be written.
  -e, --env=env              If used configuration options are loaded from .livingdocs-cli file.
  -p, --project=project      If used configuration options are loaded from .livingdocs-cli file.
  -u, --designUri=designUri  (required) URL of the design to import
```

_See code: [src/commands/project-config/import-design.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v2.0.0/src/commands/project-config/import-design.js)_

## `livingdocs-cli project-config:plan`

See what would be updated in a publish command

```
USAGE
  $ livingdocs-cli project-config:plan

OPTIONS
  -d, --dist=dist        (required) The folder or filename to the channelConfig.
  -e, --env=env          If used configuration options are loaded from .livingdocs-cli file.

  -h, --host=host        (required) [default: http://localhost:9090] The livingdocs host.
                         Can be set by the environment variable 'LI_HOST'.

  -p, --project=project  If used configuration options are loaded from .livingdocs-cli file.

  -t, --token=token      (required) Access Token for your project (needs `public-api:config:write` permission).
                         Can be set by the environment variable 'LI_TOKEN'.
```

_See code: [src/commands/project-config/plan.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v2.0.0/src/commands/project-config/plan.js)_

## `livingdocs-cli project-config:publish`

Publish a ChannelConfig to your project

```
USAGE
  $ livingdocs-cli project-config:publish

OPTIONS
  -d, --dist=dist        (required) The folder or filename to the channelConfig.
  -e, --env=env          If used configuration options are loaded from .livingdocs-cli file.

  -h, --host=host        (required) [default: http://localhost:9090] The livingdocs host.
                         Can be set by the environment variable 'LI_HOST'.

  -p, --project=project  If used configuration options are loaded from .livingdocs-cli file.

  -t, --token=token      (required) Access Token for your project (needs `public-api:config:write` permission).
                         Can be set by the environment variable 'LI_TOKEN'.
```

_See code: [src/commands/project-config/publish.js](https://github.com/livingdocsIO/livingdocs-cli/blob/v2.0.0/src/commands/project-config/publish.js)_
<!-- commandsstop -->
