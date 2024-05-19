import {dialog} from 'electron';
import {dirname} from 'path';
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'fs';
import {execFile} from 'child_process';

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
  return `${_app.getAppPath()}/settings.json`;
}

export function settingsFileExists(_app) {
  return existsSync(getSettingsPath(_app));
}

export function createSettingsFile(_app) {
  const settingsPath = getSettingsPath(_app);
  const defaultSettings = {
    wowPath: '',
    wowVersion: 'retail',
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

export async function readREFlexData(wowPath, accPath, realmPath, charPath) {
  const REFlexFile = wowPath + '\\WTF\\Account\\' + accPath + '\\' + realmPath + '\\' + charPath + '\\SavedVariables\\REFlex.lua';
  const luaPath = process.cwd() + '\\lua';
  const luaExecutable = luaPath + '\\lua54.exe';
  const luaScriptPath = luaPath + '\\parseREFlex.lua';

  if (existsSync(REFlexFile)) {
    try {
      return await executeLuaScriptWithParam(luaExecutable, luaScriptPath, REFlexFile);
    } catch (error) {
      console.error('Failed to execute Lua script:', error);
      throw error;
    }
  } else {
    throw new Error(`REFlex file does not exist: ${REFlexFile}`);
  }
}

// Function to execute a Lua script with a parameter
function executeLuaScriptWithParam(luaExecutable,scriptPath, param, callback) {
  return new Promise((resolve, reject) => {
    execFile(luaExecutable, [scriptPath, param], (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Lua script: ${error.message}`);
        reject(error);
      }
      if (stderr) {
        console.error(`Lua script error: ${stderr}`);
        reject(stderr);
      }
      try {
        const jsonOutput = JSON.parse(stdout);
        resolve(jsonOutput);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}
