import * as path from 'path'
import * as fs from 'fs'
import * as Handlebars from 'handlebars'
import * as helpers from './helpers'

export interface Wrap {
  name: string,
  path: string
}

export interface Context {
  wrappers: Array<Wrap>
}

export default class IndexTemplate {
  handlebars: typeof Handlebars
  templatesDir: string
  outputDir: string
  private _template?: Handlebars<Context>

  constructor (templatesDir: string, outputDir: string) {
    this.handlebars = Handlebars.create()
    this.templatesDir = templatesDir
    this.outputDir = outputDir
    this.registerPartials()
    this.registerHelpers()
  }

  get template () {
    if (this._template) {
      return this._template
    } else {
      let contents = this.readTemplate('index.mustache')
      this._template = this.handlebars.compile<Context>(contents)
      return this._template
    }
  }

  registerPartials () {
    fs.readdirSync(this.templatesDir).forEach(file => {
      let match = file.match(/^_(\w+)\.(handlebars|mustache)/)
      if (match) {
        this.handlebars.registerPartial(match[1], this.readTemplate(file))
      }
    })
  }

  registerHelpers () {
    this.handlebars.registerHelper('inputType', helpers.inputType)
    this.handlebars.registerHelper('outputType', helpers.outputType)
  }

  render (filePaths: Array<string>) {
    let wrappers = []
    filePaths.forEach(filePath => {
      const basename = path.basename(filePath, path.extname(filePath))
      wrappers.push({
        name: path.parse(filePath).name,
        path: `./${basename}`
      })
    })
    let context = { wrappers }
    let code = this.template(context)
    let indexFilePath = `${this.outputDir}/index.ts`
    fs.writeFileSync(indexFilePath, code)
  }

  protected readTemplate (name: string) {
    let file = path.resolve(this.templatesDir, name)
    return fs.readFileSync(file).toString()
  }
}
