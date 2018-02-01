#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import * as sources from './sources'
import * as compiler from './compiler'
import NatSpec from './NatSpec'

async function write (fileName: string, data: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(fileName, data, error => {
      error ? reject(error) : resolve()
    })
  })
}

async function main () {
  let packageJsonFilename = path.resolve(__dirname, '../../package.json')
  let packageJson = JSON.parse(fs.readFileSync(packageJsonFilename).toString())
  let whitelist = packageJson.natspec.whitelist
  let config = await sources.currentConfig()
  let fullText = await sources.requiredSources(config)
  let solcOutput = await compiler.doc(fullText)
  let natSpec = await NatSpec.build(solcOutput, whitelist)
  let outputFile = path.join(config.build_directory, 'doc', 'natspec.json')
  let asString = JSON.stringify(natSpec, null, 4)
  await write(outputFile, asString)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
