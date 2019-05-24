# Developer Guidelines

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

```bash
export LI_TOKEN=YOUR_TOKEN
./bin/run component-library:upload --assets test/fixtures/assets
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

livingdocs component-library:build --src component-library
```

## Writing tests

`const {expect, test} = require('@oclif/test')`

The `test` variable from oclif is based on fancy-test: https://github.com/jdxcode/fancy-test


## Further Notes

This repo uses the CLI framework `oclif`. You can learn about oclif on https://oclif.io/

And here is an rticle from an oclif author about '12 factor cli apps': https://medium.com/@jdxcode/12-factor-cli-apps-dd3c227a0e46

Test Images:
https://www.w3.org/People/mimasa/test/imgformat/
