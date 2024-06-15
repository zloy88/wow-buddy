# WoW-Buddy

An Electron application with Vue

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build
Commands need admin rights to be executed.
```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

### Deploy
To deploy a new version, the following steps have to be executed:
increase the version in the `package.json` file
```json
{
  "version": "0.1.0"
}
```
Create a new build for the desired platform
```bash
npm run build:win
```
After a successful build, the installer will be located in the `dist` folder.
All files in the `dist` folder have to be added to the release on GitHub.
https://github.com/zloy88/wow-buddy-release/releases

Attach the following files to a new release:
- `wow-buddy-<version>-setup.exe`
- `wow-buddy-<version>-setup.exe.blockmap`
- `builder-debug.yml`
- `builder-effective-config.yaml`
- `latest.yml`
