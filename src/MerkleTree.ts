import { Buffer } from 'buffer'
import * as util from 'ethereumjs-util'

function isHash (buffer: Buffer): boolean {
  return buffer.length === 32 && Buffer.isBuffer(buffer)
}

function isNotHash (buffer: Buffer): boolean {
  return !isHash(buffer)
}

function combinedHash (first: Buffer, second: Buffer): Buffer {
  if (!second) {
    return first
  }
  if (!first) {
    return second
  }
  let sorted = Buffer.concat([first, second].sort(Buffer.compare))
  return util.sha3(sorted)
}

function getNextLayer (elements: Array<Buffer>): Array<Buffer> {
  return elements.reduce<Array<Buffer>>((layer, element, index, arr) => {
    if (index % 2 === 0) {
      layer.push(combinedHash(element, arr[index + 1]))
    }
    return layer
  }, [])
}

function getLayers (elements: Array<Buffer>): Array<Array<Buffer>> {
  if (elements.length === 0) {
    return [[Buffer.from('')]]
  }
  let layers = []
  layers.push(elements)
  while (layers[layers.length - 1].length > 1) {
    layers.push(getNextLayer(layers[layers.length - 1]))
  }
  return layers
}

function getPair (index: number, layer: Array<Buffer>): Buffer|null {
  let pairIndex = index % 2 ? index - 1 : index + 1
  if (pairIndex < layer.length) {
    return layer[pairIndex]
  } else {
    return null
  }
}

function deduplicate (buffers: Array<Buffer>): Array<Buffer> {
  return buffers.filter((buffer, i) => {
    return buffers.findIndex(e => e.equals(buffer)) === i
  })
}

export default class MerkleTree {
  elements: Array<Buffer>
  layers: Array<Array<Buffer>>
  _root?: Buffer

  get root (): Buffer {
    if (!this._root) {
      this._root = this.layers[this.layers.length - 1][0]
    }
    return this._root
  }

  constructor (elements: Array<Buffer>) {
    // check buffers
    if (elements.some(isNotHash)) {
      throw new Error('elements must be 32 byte buffers')
    }

    this.elements = deduplicate(elements)
    this.elements.sort(Buffer.compare)

    this.layers = getLayers(this.elements)
  }

  static verify (proof: Array<Buffer>, root: Buffer, element: Buffer): boolean {
    return root.equals(proof.reduce((hash, pair) => combinedHash(hash, pair), element))
  }

  proof (element: Buffer): Array<Buffer> {
    let index = this.elements.findIndex(e => e.equals(element))
    if (index === -1) {
      throw new Error('element not found in merkle tree')
    }

    return this.layers.reduce((proof, layer) => {
      let pair = getPair(index, layer)
      if (pair) {
        proof.push(pair)
      }
      index = Math.floor(index / 2)
      return proof
    }, [])
  }
}
