/**
 * Checks a node is an enumerable object.
 * @param {*} node - A node to check.
 * @returns {boolean} Is the node an enumerable object.
 */
export const isObject = node => typeof node === 'object' && node !== null

/**
 * A file extraction.
 * @typedef {Object} ExtractedFile
 * @property {String} path - Original location in the object tree.
 * @property {String} file - The actual file.
 */

/**
 * Reversibly extracts files from an object tree.
 * @param {Object} tree - An object tree to extract files from.
 * @param {string} [treePath=''] - Optional tree path to prefix file paths.
 * @returns {ExtractedFile[]} Extracted files.
 */
export default function extractFiles(tree, treePath = '') {
  const files = []

  /**
   * Recursively extracts files from a tree node.
   * @param {Object} node Object tree node.
   * @param {string} nodePath Object tree path.
   */
  const recurse = (node, nodePath) => {
    // Iterate enumerable properties of the node.
    Object.keys(node).forEach(key => {
      // Skip non-object.
      if (!isObject(node[key])) return

      const path = `${nodePath}${key}`

      if (
        // Node is a File.
        (typeof File !== 'undefined' && node[key] instanceof File) ||
        // Node is a Blob.
        (typeof Blob !== 'undefined' && node[key] instanceof Blob) ||
        // Node is a ReactNativeFile.
        node[key] instanceof ReactNativeFile
      ) {
        // Extract the file and it's object tree path.
        files.push({ path, file: node[key] })

        // Delete the file. Array items must be deleted without reindexing to
        // allow repopulation in a reverse operation.
        node[key] = null

        // No further checks or recursion.
        return
      }

      if (typeof FileList !== 'undefined' && node[key] instanceof FileList)
        // Convert read-only FileList to an array for manipulation.
        node[key] = Array.prototype.slice.call(node[key])

      // Recurse into child node.
      recurse(node[key], `${path}.`)
    })
  }

  if (isObject(tree))
    // Recurse object tree.
    recurse(
      tree,
      // If a tree path was provided, append a dot.
      treePath === '' ? treePath : `${treePath}.`
    )

  return files
}

/**
 * A React Native FormData file object.
 * @see {@link https://github.com/facebook/react-native/blob/v0.45.1/Libraries/Network/FormData.js#L34}
 * @typedef {Object} ReactNativeFileObject
 * @property {String} uri - File system path.
 * @property {String} [type] - File content type.
 * @property {String} [name] - File name.
 */

/**
 * A React Native file.
 * @param {ReactNativeFileObject} file A React Native FormData file object.
 * @example
 * const file = new ReactNativeFile({
 *  uri: uriFromCameraRoll,
 *  type: 'image/jpeg',
 *  name: 'photo.jpg'
 * })
 */
export class ReactNativeFile {
  // eslint-disable-next-line require-jsdoc
  constructor({ uri, type, name }) {
    this.uri = uri
    this.type = type
    this.name = name
  }

  /**
   * Creates an array of React Native file instances.
   * @param {ReactNativeFileObject[]} files React Native FormData file objects.
   * @returns {ReactNativeFile[]} Array of React Native file instances.
   * @example
   * const files = ReactNativeFile.list([{
   *   uri: uriFromCameraRoll1,
   *   type: 'image/jpeg',
   *   name: 'photo-1.jpg'
   * }, {
   *   uri: uriFromCameraRoll2,
   *   type: 'image/jpeg',
   *   name: 'photo-2.jpg'
   * }])
   */
  static list = files => files.map(file => new ReactNativeFile(file))
}
