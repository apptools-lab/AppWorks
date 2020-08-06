import * as _ from 'lodash';

export const getSchemaDefaultValue = (schema) => {
  const DefaultSchema = {};
  _.forIn(schema.properties, (value, key) => {
    DefaultSchema[key] = value.default;
  });
  return DefaultSchema;
};

export function createIncremetalUpdate(formData, lastSyncJson, schemaDefaultValue, formCannotEditProps) {
  const incrementalChange = {};
  const newSyncJson = { ...lastSyncJson };
  _.forIn(lastSyncJson, (value, key) => {
    if (!formCannotEditProps.includes(key) && !_.isEqual(value, formData[key])) {
      incrementalChange[key] = formData[key];
      newSyncJson[key] = formData[key];
    }
  });
  _.forIn(formData, (value, key) => {
    if ([...formCannotEditProps, ...Object.keys(lastSyncJson)].includes(key)) {
      // change nothing
    } else if (schemaDefaultValue[key] !== undefined && !_.isEqual(formData[key], schemaDefaultValue[key])) {
      newSyncJson[key] = value;
      incrementalChange[key] = value;
    }
  });
  return { incrementalChange, newSyncJson };
}

export function getSyncContentAfterUpdate(userSetting, latestSyncJson) {
  if (!userSetting || !latestSyncJson) {
    return;
  }
  const syncJson = { ...latestSyncJson };
  _.forIn(userSetting, (value, key) => {
    if (value === null) {
      delete syncJson[key];
    } else {
      syncJson[key] = value;
    }
  });
  return syncJson;
}

export const getUISchema = (formCannotEditProps) => {
  const uiSchema = {};
  formCannotEditProps.forEach((prop) => {
    uiSchema[prop] = { 'ui:field': 'EditInFile' };
  });
  return uiSchema;
};
