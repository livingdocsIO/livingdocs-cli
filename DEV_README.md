# Developer Guidelines

## Using the CLI locally

```sh
export LI_TOKEN=YOUR_TOKEN

# A) Download a config and display in the console
./bin/run project-config:download

# B) Download a config into /my-project
./bin/run project-config:download -d tmp/project

# B) Download a config into /tmp/project and write components as Html files
./bin/run project-config:download -d tmp/project --format=js/html

# See what a publish would change
./bin/run project-config:plan -d tmp/project

# Publish the config in /tmp/project
./bin/run project-config:publish -d tmp/project

# Run a local design server serving built design jsons from dist/designs
./bin/run design-server:start -d dist/designs
```

## Using a .livingdocs-cli file

Managing different environments in your config file:
```json
{
  "environments": {
    "local": {
      "host": "https://localhost:9071",
      "token": "local-token",
      "distFolder": "./project-config/local"
    },
    "production": {
      "host": "https://production.your-service.com",
      "token": "production-token",
      "distFolder": "./project-config/production"
    }
  }
}
```

Example usage:
```bash
npx livingdocs-cli project-config:download --env local
```

Managing different projects and environments in your config file:
```json
{
  "projects": {
    "my-project": {
      "environments": {
        "development": {
          "host": "https://localhost:9071",
          "token": "development-token",
          "distFolder": "./project-config/development"
        },
        "production": {
          "host": "https://production.your-service.com",
          "token": "production-token",
          "distFolder": "./project-config/production"
        }
      }
    }
  },
  "alias": {
    "dev": "development"
  }
}
```

Example usage:
```bash
npx livingdocs-cli project-config:download --project my-project --env dev
```

## Running the tests

```bash
# Run the tests
npm run test
```

Or you can call the cli manually.
For example to parse and build the test fixtures manually:
```bash
./bin/run component-library:build --src test/fixtures/component-library
```

## Test helpers

Here are some of the available test helpers:

```js
test
  // mute stdout. Caution: this mutes logs and error messages,
  // comment out when debugging.
  .stdout()
  // create a temporary folder and set env variable 'LI_DIST_FOLDER'
  .tmpdir()
  // setting environment variables
  .env({LI_FOO: 'BAR'})
  // run a command (the same as if you would in the terminal)
  .command('config:print'.split(' '))
```

## Updating the readme

```bash
npx oclif-dev readme
```

## Testing manually locally within another repository

```bash
# After downloading the repo run `npm link`.
npm link

# Go to a delivery or component library project where you want to test
# the CLI within a real project.
cd ../some-other-repo

livingdocs-cli component-library:build --src component-library
```

## Writing tests

`const {expect, test} = require('@oclif/test')`

The `test` variable from oclif is based on fancy-test: https://github.com/jdxcode/fancy-test

## Further Notes

This repo uses the CLI framework `oclif`. You can learn about oclif on https://oclif.io/

And here is an rticle from an oclif author about '12 factor cli apps': https://medium.com/@jdxcode/12-factor-cli-apps-dd3c227a0e46

Test Images:
https://www.w3.org/People/mimasa/test/imgformat/
