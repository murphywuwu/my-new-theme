const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const SlateConfig = require('../slate-config/index');
const config = new SlateConfig(require('./slate-env.schema'));

const SLATE_ENV_VARS = [
  config.get('env.keys.name'),
  config.get('env.keys.store'),
  config.get('env.keys.password'),
  config.get('env.keys.themeId'),
  config.get('env.keys.ignoreFiles'),
  config.get('env.keys.timeout'),
  config.get('env.keys.userEmail')
];

const DEFAULT_ENV_VARS = [
  config.get('env.keys.store'),
  config.get('env.keys.password'),
  config.get('env.keys.themeId'),
  config.get('env.keys.ignoreFiles')
];

function create({ values, name, root } = {}) {
  const envName = _getFileName(name);
  const envPath = path.resolve(
    root || config.get('env.rootDirectory'),
    envName,
  );
  const envContents = _getFileContents(values);

  fs.writeFileSync(envPath, envContents);
}

function _getFileName(name) {
  if (typeof name === 'undefined' || name.trim() === '') {
    return config.get('env.basename');
  }

  return `${config.get('env.basename')}.${name}`;
}

function _getFileContents(values) {
  const env = getDefaultSlateEnv();
  for (const key in values) {
    if (values.hasOwnProperty(key) && env.hasOwnProperty(key)) {
      env[key] = values[key];
    }
  }
  
  return Object.entries(env)
  .map((KeyValues) => {
    return `${KeyValues.join('=')}\r\n`;
  })
  .join('\r\n\r\n');
}

function assign(name) {
  const envFileName = _getFileName(name);
  const envPath = path.resolve(config.get('env.rootDirectory'), envFileName);
  const result = dotenv.config({ path: envPath });

  if (typeof name !== 'undefined' && result.error) {
    throw result.error;
  }
  _setEnvName(name);
}

function _setEnvName(name) {
  let envName = name;
  const envFileName = _getFileName(name);
  const envPath = path.resolve(config.get('env.rootDirectory'), envFileName);

  if (typeof name === 'undefined') {
    if (fs.existsSync(envPath)) {
      envName = config.get('env.defaultEnvName');
    }
    else {
      envName = config.get('env.externalEnvName');
    }
  }

  process.env[config.get('env.keys.name')] = envName;
}


function getDefaultSlateEnv() {
  const env = {};

  DEFAULT_ENV_VARS.forEach((key) => {
    env[key] = '';
  });

  return env;
}


function getStoreValue() {
  const value = process.env[config.get('env.keys.store')];

  return typeof value === 'undefined' ? '' : value;
}

function getPasswordValue() {
  const value = process.env[config.get('env.keys.password')];
  return typeof value === 'undefined' ? '' : value;
}

function getThemeIdValue() {
  const value = process.env[config.get('env.keys.themeId')];
  return typeof value === 'undefined' ? '' : value;
}

function getIgnoreFilesValue() {
  const value = process.env[config.get('env.keys.ignoreFiles')];
  return typeof value === 'undefined' ? '' : value;
}

function getTimeoutValue() {
  const value = process.env[config.get('env.keys.timeout')];
  
  return typeof value === 'undefined' ? '' : value;
}

function getUserEmail() {
  const value = process.env[config.get('env.keys.userEmail')];
  return typeof value === 'undefined' ? '' : value;
}



module.exports = {
  create,
  assign,
  validate,
  clear,
  getSlateEnv,
  getDefaultSlateEnv,
  getEmptySlateEnv,
  getEnvNameValue,

  getStoreValue,
  getPasswordValue,
  getThemeIdValue,
  getIgnoreFilesValue,
  getTimeoutValue,
  getUserEmail,
}