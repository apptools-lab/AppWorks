import * as _ from 'lodash';

export const getSchemaDefaultValue = (schema) => {
  const DefaultSchema = {};
  _.forIn(schema.properties, (value, key) => {
    DefaultSchema[key] = value.default;
  });
  return DefaultSchema;
};

export function createIncremetalUpdate(currentConfig, lastSyncJson, defaultSchema, formCannotEditProps) {
  const incrementalChange = {};
  const syncJson = { ...lastSyncJson };

  _.forIn(lastSyncJson, (value, key) => {
    if (!formCannotEditProps.includes(key) && !_.isEqual(value, currentConfig[key])) {
      incrementalChange[key] = currentConfig[key];
      syncJson[key] = currentConfig[key];
    }
  });

  _.forIn(currentConfig, (value, key) => {
    if ([...formCannotEditProps, ...Object.keys(lastSyncJson)].includes(key)) {
      // change nothing
    } else if (defaultSchema[key] !== undefined && !_.isEqual(currentConfig[key], defaultSchema[key])) {
      syncJson[key] = value;
      incrementalChange[key] = value;
    }
  });
  return { incrementalChange, newSyncJsonContentObj: syncJson };
}

export function getSyncContentAfterUpdate(userSetting, oldSyncJsonContent) {
  if (!userSetting || !oldSyncJsonContent) {
    return;
  }
  const newSyncJsonContent = oldSyncJsonContent;
  _.forIn(userSetting, (value, key) => {
    if (value === null) {
      delete newSyncJsonContent[key];
    } else {
      newSyncJsonContent[key] = value;
    }
  });
  return newSyncJsonContent;
}

export const getUISchema = (formCannotEditProps) => {
  const uiSchema = {};
  formCannotEditProps.forEach((prop) => {
    uiSchema[prop] = { 'ui:field': 'EditInFile' };
  });
  return uiSchema;
};
