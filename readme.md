[![Npm Version](https://img.shields.io/npm/v/shimo-upv.svg?style=flat)](https://img.shields.io/npm/v/shimo-upv.svg?style=flat)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Update Package Version (UPV)

Update your nodejs app package version in package.json and git commit it automatically.

The commit message is like `chore: update package version to 2.2.2`.

## Install

`npm i -g shimo-upv`

## Usage

`upv your-pacakge-name your-package-version [-p]`

Use `-p` option if you want ti push that commit to git.

### example

`upv lodash 4.0.0 -p`

# License

MIT
