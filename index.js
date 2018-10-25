#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const program = require('commander')
const pkg = require('./package.json')
const { spawnSync } = require('child_process')

let packageName
let packageVersion

program
  .version(pkg.version)
  .arguments('<packageName> <packageVersion>')
  .action((pn, pv) => {
    packageName = pn
    packageVersion = pv
  })
  .option('-p, --push', 'Push to git after npm install')
  .parse(process.argv)

const CWD = process.cwd()
const semverRegexp = /^([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/

if (!packageName) {
  processEnd('No package name given!')
}

if (!packageVersion) {
  processEnd('No package version given!')
}

if (!semverRegexp.test(packageVersion)) {
  processEnd('Package version is illegal!')
}

if (!fs.existsSync(path.join(CWD, './.git'))) {
  processEnd('Current folder is not a git repo!')
}

if (!fs.existsSync(path.join(CWD, './package.json'))) {
  processEnd('Current folder has no `package.json` file!')
}

const steps = [
  {
    cmd: ['git', ['stash', '-u']]
  },
  {
    cmd: ['npm', ['install', `${packageName}@${packageVersion}`]]
  },
  {
    cmd: ['git', ['add', '.']]
  },
  {
    cmd: ['git', ['commit', '-m', `chore: update ${packageName} version to ${packageVersion}`]]
  }
]

if (program.push) {
  steps.push(
    {
      cmd: ['git', ['push']]
    }
  )
}

steps.push({
  cmd: ['git', ['stash', 'pop']]
})

console.log(`You are updating pacakge ${chalk.blue(packageName)} to version ${chalk.blue(packageVersion)} now.`)

steps.forEach((step, index) => {
  console.log(chalk.white.bgBlue(`Step ${index + 1}, Running \`${step.cmd[0] + ' ' + step.cmd[1].join(' ')}\`...`))
  spawnSync.apply(null, step.cmd.concat({ stdio: 'inherit' }))
})

console.log(chalk.black.bgGreen('All done!'))

function processEnd (message) {
  console.error(chalk.red('Error:', message))
  process.exit(1)
}
