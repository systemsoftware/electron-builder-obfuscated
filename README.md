# Electron App Obfuscation & Build Script

This Node.js script automates the obfuscation of JavaScript files in an Electron app and builds it using `electron-builder`. The original source is preserved, and a temporary obfuscated version is used for building.

## 🔧 Features

* Recursively obfuscates all `.js` files (excluding `node_modules`) using `javascript-obfuscator`
* Copies the source to a temporary directory to avoid modifying original files
* Removes `.git` and `.gitignore` from the build directory
* Builds the app with `electron-builder` for macOS and Windows



## 📦 Prerequisites

* Node.js
* `electron-builder` installed globally or in your project
* `javascript-obfuscator` installed

```bash
npm install -g electron-builder && npm install javascript-obfuscator
```



## 🚀 Usage

```bash
./build-obfuscated.js <sourceDir> <tempBuildDir> [--no-sign]
```

### Parameters

| Argument         | Description                                                                                       |
| - | - |
| `<sourceDir>`    | Path to your Electron app source. Defaults to `src/`.                                             |
| `<tempBuildDir>` | Path to a temp directory for the obfuscated build. Defaults to `~/Desktop/temp-build-obfuscated`. |
| `--no-sign`      | (Optional) Prevents code signing by disabling `CSC_IDENTITY_AUTO_DISCOVERY`.                      |



## 🔒 Example

```bash
./build-obfuscated.js src ~/Desktop/obf-build --no-sign
```

This will:

* Copy the contents of `src/` to `~/Desktop/obf-build`
* Obfuscate all `.js` files in the copied directory
* Remove `.git` and `.gitignore`
* Run `electron-builder` from the obfuscated directory without signing



## 📁 Output

The built app for macOS and Windows will be created in the `dist/` directory inside the temp build folder.



## 📝 Notes

* Only `.js` files are obfuscated. HTML and CSS files are not touched.
* Ensure that the copied source directory contains a valid `package.json` and `electron-builder` config.


## ⚠️ Disclaimer

This script is intended to provide basic obfuscation and build automation. Obfuscation is not a substitute for proper code protection.