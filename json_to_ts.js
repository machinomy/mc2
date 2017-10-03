var fs = require('fs')
const path = './build/contracts/'
fs.readdirSync(path).forEach(function (filename) {
  let data = fs.readFileSync(path + filename, 'utf8')
  let arr = data.split('\n').slice(1)
  arr.unshift('export default {')
  let linesExceptFirst = arr.join('\n')
  let newFilename = filename.split('.')
  newFilename.pop()
  newFilename.push('ts')
  newFilename = newFilename.join('.')
  fs.writeFileSync(path + newFilename, linesExceptFirst);
});