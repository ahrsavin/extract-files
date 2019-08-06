# extract-files

[![npm version](https://badgen.net/npm/v/extract-files)](https://npm.im/extract-files) [![Build status](https://travis-ci.org/jaydenseric/extract-files.svg?branch=master)](https://travis-ci.org/jaydenseric/extract-files)

Clones a value, recursively extracting [`File`](https://developer.mozilla.org/docs/web/api/file), [`Blob`](https://developer.mozilla.org/docs/web/api/blob) and [`ReactNativeFile`](#class-reactnativefile) instances with their [object paths](#type-objectpath), replacing them with `null`. [`FileList`](https://developer.mozilla.org/docs/web/api/filelist) instances are treated as [`File`](https://developer.mozilla.org/docs/web/api/file) instance arrays.

Used by [GraphQL multipart request spec client implementations](https://github.com/jaydenseric/graphql-multipart-request-spec#implementations) such as [`graphql-react`](https://npm.im/graphql-react) and [`apollo-upload-client`](https://npm.im/apollo-upload-client).

## Usage

Install with [npm](https://npmjs.com):

```shell
npm install extract-files
```

See the [`extractFiles`](#function-extractfiles) documentation to get started.

## Support

- Node.js v8.5+
- Browsers [`> 0.5%, not dead`](https://browserl.ist/?q=%3E+0.5%25%2C+not+dead)
- React Native

## API

### Table of contents

- [class ReactNativeFile](#class-reactnativefile)
- [function extractFiles](#function-extractfiles)
- [function isExtractableFile](#function-isextractablefile)
- [type ExtractableFile](#type-extractablefile)
- [type ExtractableFileMatcher](#type-extractablefilematcher)
- [type ExtractFilesResult](#type-extractfilesresult)
- [type ObjectPath](#type-objectpath)
- [type ReactNativeFileSubstitute](#type-reactnativefilesubstitute)

### class ReactNativeFile

Used to mark a [React Native `File` substitute](#type-reactnativefilesubstitute) in an object tree for [`extractFiles`](#function-extractfiles). It’s too risky to assume all objects with `uri`, `type` and `name` properties are files to extract.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `file` | [ReactNativeFileSubstitute](#type-reactnativefilesubstitute) | A React Native [`File`](https://developer.mozilla.org/docs/web/api/file) substitute. |

#### Examples

_An extractable file in React Native._

> ```js
> import { ReactNativeFile } from 'extract-files'
>
> const file = new ReactNativeFile({
>   uri: uriFromCameraRoll,
>   name: 'a.jpg',
>   type: 'image/jpeg'
> })
> ```

---

### function extractFiles

Clones a value, recursively extracting [`File`](https://developer.mozilla.org/docs/web/api/file), [`Blob`](https://developer.mozilla.org/docs/web/api/blob) and [`ReactNativeFile`](#class-reactnativefile) instances with their [object paths](#type-objectpath), replacing them with `null`. [`FileList`](https://developer.mozilla.org/docs/web/api/filelist) instances are treated as [`File`](https://developer.mozilla.org/docs/web/api/file) instance arrays.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `value` | \* | Value (typically an object tree) to extract files from. |
| `path` | [ObjectPath](#type-objectpath)? = `''` | Prefix for object paths for extracted files. |
| `isExtractableFile` | [ExtractableFileMatcher](#type-extractablefilematcher)? = [isExtractableFile](#function-isextractablefile) | The function used to identify extractable files. |

**Returns:** [ExtractFilesResult](#type-extractfilesresult) — Result.

#### Examples

_Extract files from an object._

> For the following:
>
> ```js
> import { extractFiles } from 'extract-files'
>
> const file1 = new File(['1'], '1.txt', { type: 'text/plain' })
> const file2 = new File(['2'], '2.txt', { type: 'text/plain' })
> const value = {
>   a: file1,
>   b: [file1, file2]
> }
>
> const { clone, files } = extractFiles(value, 'prefix')
> ```
>
> `value` remains the same.
>
> `clone` is:
>
> ```js
> {
>   a: null,
>   b: [null, null]
> }
> ```
>
> `files` is a [`Map`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) instance containing:
>
> | Key     | Value                        |
> | :------ | :--------------------------- |
> | `file1` | `['prefix.a', 'prefix.b.0']` |
> | `file2` | `['prefix.b.1']`             |

---

### function isExtractableFile

Checks if a value is an [extractable file](#type-extractablefile).

**Type:** [ExtractableFileMatcher](#type-extractablefilematcher)

| Parameter | Type | Description     |
| :-------- | :--- | :-------------- |
| `value`   | \*   | Value to check. |

**Returns:** boolean — Is the file extractable.

#### Examples

_How to import._

> ```js
> import { isExtractableFile } from 'extract-files'
> ```

---

### type ExtractableFile

An extractable file.

**Type:** File | Blob | [ReactNativeFile](#class-reactnativefile)

---

### type ExtractableFileMatcher

A function that checks if a value is an extractable file.

**Type:** Function

#### See

- [`isExtractableFile`](#function-isextractablefile) is the default extractable file matcher.

#### Examples

_How to check for the default exactable files, as well as a custom type of file._

> ```js
> import { isExtractableFile } from 'extract-files'
>
> const isExtractableFileEnhanced = value =>
>   isExtractableFile(value) ||
>   (typeof CustomFile !== 'undefined' && value instanceof CustomFile)
> ```

---

### type ExtractFilesResult

What [`extractFiles`](#function-extractfiles) returns.

**Type:** object

| Property | Type | Description |
| :-- | :-- | :-- |
| `clone` | \* | Clone of the original input value with files recursively replaced with `null`. |
| `files` | Map&lt;[ExtractableFile](#type-extractablefile), Array&lt;[ObjectPath](#type-objectpath)>> | Extracted files and their locations within the original value. |

---

### type ObjectPath

String notation for the path to a node in an object tree.

**Type:** string

#### See

- [`object-path` on npm](https://npm.im/object-path).

#### Examples

_Object path is property `a`, array index `0`, object property `b`._

>     a.0.b

---

### type ReactNativeFileSubstitute

A React Native [`File`](https://developer.mozilla.org/docs/web/api/file) substitute for when using [`FormData`](https://developer.mozilla.org/docs/web/api/formdata).

**Type:** object

| Property | Type    | Description        |
| :------- | :------ | :----------------- |
| `uri`    | string  | Filesystem path.   |
| `name`   | string? | File name.         |
| `type`   | string? | File content type. |

#### See

- [React Native `FormData` polyfill source](https://github.com/facebook/react-native/blob/v0.45.1/Libraries/Network/FormData.js#L34).

#### Examples

_A camera roll file._

> ```js
> {
>   uri: uriFromCameraRoll,
>   name: 'a.jpg',
>   type: 'image/jpeg'
> }
> ```
