import {dialog} from 'electron';
import {dirname} from 'path';
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'fs';
import {mapReflexLuaTable} from './mapReflexLuaTable';

export async function selectWowFolder() {
  const winPath = 'C:\\Program Files (x86)\\World of Warcraft\\_retail_';
  const macPath = '/Applications/World of Warcraft/_retail_';
  const executableName = process.platform === 'darwin' ? 'World of Warcraft.app' : 'Wow.exe';
  const dialogResult = await dialog.showOpenDialog({
    title: `Select your ${executableName}`,
    buttonLabel: 'Select',
    properties: ['openFile'],
    defaultPath: process.platform === 'darwin' ? macPath : winPath,
    filters: [
      {
        name: executableName,
        extensions: [process.platform === 'darwin' ? 'app' : 'exe'],
      },
    ],
  });
  if (!dialogResult.canceled && dialogResult.filePaths.length > 0) {
    const wowExePath = dialogResult.filePaths[0];
    const wowDirectory = dirname(wowExePath);
    if (wowDirectory) {
      return wowDirectory;
    }

    dialog.showMessageBox({
      title: 'Invalid Location',
      message: `Please select "${executableName}" in a valid World of Warcraft installation.`,
      type: 'error',
    });
  }
  throw new Error('No valid directory selected');
}

export function getSettingsPath(_app) {
  return `${_app.getPath('userData')}/settings.json`;
}

export function settingsFileExists(_app) {
  return existsSync(getSettingsPath(_app));
}

export function createSettingsFile(_app) {
  const settingsPath = getSettingsPath(_app);
  const defaultSettings = {
    locale: Intl.DateTimeFormat().resolvedOptions().locale,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    wowPath: '',
    wowVersion: 'retail',
    wowRegion: '',
    wowAccountFolders: [],
    wowRealmFolders: [],
    wowCharacterFolders: [],
    selectedAccountFolder: '',
    selectedRealmFolder: '',
    selectedCharacterFolder: '',
  };
  writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2), {
    encoding: 'utf-8',
  });
}

export function updateSettingsFile(_app, settings) {
  if (getSettings(_app)) {
    const settingsPath = getSettingsPath(_app);
    writeFileSync(settingsPath, JSON.stringify(settings, null, 2), {
      encoding: 'utf-8',
    });
  }
}

// Update Key/Value pair in settings object, but do not overrite the whole object
export function updateSettingsObject(_app, key, value) {
  const settings = getSettings(_app);
  settings[key] = value;
  updateSettingsFile(_app, settings);
}

export function getSettings(_app) {
  const settingsPath = getSettingsPath(_app);
  if (!existsSync(settingsPath)) {
    return null;
  }
  // return the settings object
  return JSON.parse(readFileSync(settingsPath, 'utf-8'));
}

// read folders within the wow directory
export async function getWowAccountFolders(wowPath) {
  const folders = [];
  if (existsSync(wowPath)) {
    const files = readdirSync(wowPath + '\\WTF\\Account', {withFileTypes: true});
    files.forEach((file) => {
      if (file.isDirectory() && file.name !== 'SavedVariables' && file.name !== 'SavedVariables.bak') {
        folders.push(file.name);
      }
    });
  }
  return folders;
}

export async function getWowRealmFolders(wowPath, accPath) {
  const folders = [];
  const fullPath = wowPath + '\\WTF\\Account\\' + accPath;
  if (existsSync(fullPath)) {
    const files = readdirSync(fullPath, {withFileTypes: true});
    files.forEach((file) => {
      if (file.isDirectory() && file.name !== 'SavedVariables') {
        folders.push(file.name);
      }
    });
  } else {
    console.log('No such file or directory', fullPath)
  }
  return folders;
}

export async function getWowCharacterFolders(wowPath, accPath, realmPath) {
  const folders = [];
  const fullPath = wowPath + '\\WTF\\Account\\' + accPath + '\\' + realmPath;
  if (existsSync(fullPath)) {
    const files = readdirSync(fullPath, {withFileTypes: true});
    files.forEach((file) => {
      if (file.isDirectory()) {
        folders.push(file.name);
      }
    });
  } else {
    console.log('No such file or directory', fullPath)
  }
  return folders;
}

export async function readREFlexData(wowPath, accPath, realmPath, charPath, region) {
  const REFlexFile = wowPath + '\\WTF\\Account\\' + accPath + '\\' + realmPath + '\\' + charPath + '\\SavedVariables\\REFlex.lua';

  if (existsSync(REFlexFile)) {
    try {
      return await parseLuaFile(REFlexFile, accPath, realmPath, region);
    } catch (error) {
      console.error('Failed to parse Lua file:', error);
      throw error;
    }
  } else {
    throw new Error(`REFlex file does not exist: ${REFlexFile}`);
  }


}

// Function to parse LUA file with luaparse and map it to own data structure
export async function parseLuaFile(filePath, bnet_account, realm, region) {
  return mapReflexLuaTable(
    readFileSync(filePath, 'utf-8'),
    bnet_account,
    realm,
    region
  );
}

export function getRegionFromWowPath(_app, wowPath) {
  const fullPath = wowPath + '\\WTF\\Config.wtf';
  if (existsSync(fullPath)) {
    const config = readFileSync(fullPath, 'utf-8');
    const lines = config.split('\n');
    // get line that starts with SET portal
    const portalLine = lines.find((line) => line.startsWith('SET portal'));
    // get region from portal line and remove \r and " characters
    const region = portalLine.split(' ')[2].replace(/[\r"]+/g, '');
    // write region to settings
    updateSettingsObject(_app, 'wowRegion', region)

    return region;
  }
  return null;
}
