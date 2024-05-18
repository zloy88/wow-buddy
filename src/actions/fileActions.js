import {dialog} from 'electron';
import {dirname} from 'path';
import {readFileSync, writeFileSync, existsSync, readdirSync} from 'fs';

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

function parseLogFile(parser, path) {
  try {
    const fd = openSync(path, 'r');
    const buffer = readFileSync(fd);
    closeSync(fd);
    const bufferString = buffer.toString('utf-8');

    const lines = bufferString.split('\n');
    lines.forEach((line) => {
      parser.parseLine(line);
    });
  } catch (e) {
    // TODO: try to come up with some strategy to avoid these
    // Can reproduce by copy+pasting a new log file into wow folder while logger is watching (win32)
    // There are still some transient bugs
    // https://stackoverflow.com/questions/1764809/filesystemwatcher-changed-event-is-raised-twice
    return false;
  }
  return true;
}

function parseLogFileChunk(parser, path, start, size) {
  if (size <= 0) {
    return true;
  }
  try {
    const fd = openSync(path, 'r');
    const buffer = Buffer.alloc(size);
    readSync(fd, buffer, 0, size, start);
    closeSync(fd);
    let bufferString = buffer.toString('utf-8');
    // Was there a partial line left over from a previous call?
    if (chunkParitialsBuffer[path]) {
      bufferString = chunkParitialsBuffer[path] + bufferString;
    }
    const lines = bufferString.split('\n');
    lines.forEach((line, idx) => {
      if (idx === lines.length - 1) {
        if (line.length > 0) {
          chunkParitialsBuffer[path] = line;
        }
      } else {
        parser.parseLine(line);
      }
    });
  } catch (e) {
    // TODO: try to come up with some strategy to avoid these
    // Can reproduce by copy+pasting a new log file into wow folder while logger is watching (win32)
    // There are still some transient bugs
    // https://stackoverflow.com/questions/1764809/filesystemwatcher-changed-event-is-raised-twice
    return false;
  }
  return true;
}
