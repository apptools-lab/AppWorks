import * as _ from 'lodash';

export const getSchemaDefaultValue = (schema, jsonContent) => {
  const DefaultSchema = {};
  console.log('schema&content', schema, jsonContent);
  _.forIn(schema.properties, (value, key) => {
    DefaultSchema[key] = value.default !== undefined ? value.default : jsonContent[key];
  });
  console.log('DefaultSchema', DefaultSchema);
  return DefaultSchema;
};

export function createIncremetalUpdate(newData, lastSyncJson, schemaDefaultValue, formCannotEditProps) {
  const incrementalChange = {};
  const newSyncJson = { ...lastSyncJson };
  _.forIn(lastSyncJson, (value, key) => {
    // 如果老数据中的值与新数据的值不相等，则意味着发生了变更，记录更新，使用新值
    if (!formCannotEditProps.includes(key) && !_.isEqual(value, newData[key])) {
      incrementalChange[key] = newData[key];
      newSyncJson[key] = newData[key];
    }
  });
  _.forIn(newData, (value, key) => {
    if ([...formCannotEditProps, ...Object.keys(lastSyncJson)].includes(key)) {
      // change nothing
    } else if (schemaDefaultValue[key] !== undefined) {
      // 如果 schema 中有默认值
      // 1. 新数据的值不等于默认值，意味着新增了数据，记录此数据
      // 2. 新数据的值等于默认值，则丢弃此值，不记录
      if (!_.isEqual(newData[key], schemaDefaultValue[key])) {
        incrementalChange[key] = value;
        newSyncJson[key] = value;
      }
    } else {
      incrementalChange[key] = value;
      newSyncJson[key] = value;
    }
  });
  return { incrementalChange, newSyncJson };
}

export const getUISchema = (formCannotEditProps) => {
  const uiSchema = {};
  formCannotEditProps.forEach((prop) => {
    uiSchema[prop] = { 'ui:field': 'EditInFile' };
  });
  return uiSchema;
};
