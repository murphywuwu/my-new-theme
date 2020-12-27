const path = require('path');
const fs = require('fs');

global.slateUserConfig = global.slateUserConfig || getSlateUserConfig();

module.exports = class SlateConfig {

  get UserConfig() {
    return global.slateUserConfig;
  }

  get(key) {
    const defaultValue = this.schema[key];
    const userConfigValue = this.userConfig[key];
    let computedDefaultValue;

    if (
      typeof defaultValue === 'undefined' &&
      typeof userConfigValue === 'undefined'
    ) {
      throw new Error(
        `[slate-config]: A value has not been defined for the key '${key}'`
      );
    }

    if (typeof defaultValue ===  'function') {
      computedDefaultValue = defaultValue(this);
    }
    else {
      computedDefaultValue = defaultValue;
    }

    if (typeof userConfigValue === 'undefined') {
      return computedDefaultValue;
    }
    else if (typeof userConfigValue === 'function') {
      return userConfigValue(this, computedDefaultValue);
    }
    else {
      return userConfigValue;
    }
  }
}

function getSlateUserConfig() {
  const slateConfigPath = global.slateConfigPath || path.join(process.cwd(), 'slate.config.js');
  if (fs.existsSync(slateConfigPath)) {
    return require(slateConfigPath);
  } else {
    return {};
  }
}

