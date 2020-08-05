import * as _ from 'lodash';
// @ts-ignore
import testSchema from '../../schemas/ice.build.zh-cn.json';

export const initDefaultValue = (schema) => {
  const DefaultSchema = {};
  _.forIn(schema.properties, (value, key) => {
    DefaultSchema[key] = value.default;
  });
  return DefaultSchema;
};

export function isEqual(obj1, obj2) {
  return _.isEqual(obj1, obj2);
}

export function createIncremetalUpdateForExtension(
  currentConfig,
  formCannotEditProps,
  defaultSchema,
  syncJsonContentObj
) {
  const updateMessage = {};
  const newSyncJsonContentObj = { ...syncJsonContentObj };

  _.forIn(syncJsonContentObj, (value, key) => {
    if (!formCannotEditProps.includes(key) && !_.isEqual(value, currentConfig[key])) {
      updateMessage[key] = currentConfig[key];
      newSyncJsonContentObj[key] = currentConfig[key];
    }
  });

  _.forIn(currentConfig, (value, key) => {
    if ([...formCannotEditProps, ...Object.keys(syncJsonContentObj)].includes(key)) {
      // change nothing
    } else if (defaultSchema[key] !== undefined && !_.isEqual(currentConfig[key], defaultSchema[key])) {
      newSyncJsonContentObj[key] = value;
      updateMessage[key] = value;
    }
  });
  return { updateMessage, newSyncJsonContentObj };
}

export function setIncreamentalUpdateFromExtension(userSetting, oldSyncJsonContentObj) {
  if (!userSetting || !oldSyncJsonContentObj) {
    return;
  }
  const newSyncJsonContentObj = oldSyncJsonContentObj;
  _.forIn(userSetting, (value, key) => {
    if (value === null) {
      delete newSyncJsonContentObj[key];
    } else {
      newSyncJsonContentObj[key] = value;
    }
  });
  return newSyncJsonContentObj;
}

export const createUISchema = (formCannotEditProps) => {
  const uiSchema = {};
  formCannotEditProps.forEach((prop) => {
    uiSchema[prop] = { 'ui:field': 'EditInFile' };
  });
  return uiSchema;
};

export function getMockData() {
  return {
    schema: testSchema,
    webviewCannotEditProps: ['alias', 'devServer'],
    JsonContent: { devServer: {} },
  };
}
