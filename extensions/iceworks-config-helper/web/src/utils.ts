import * as _ from 'lodash';
import { IceSchema } from './pages/Home';
import ICESchema from '../../schemas/ice.build.json';

export const DefaultSchema = {};

/**
 * 由于我们使用了 edit In build.json
 * 这个模块会强制改变 json 为默认值，
 * 我们需要把输入的这个值进行保存，防止表格编辑其能力之外的值。
 * @param schema Json Schema
 */
export const formdidNotEditAttrs: string[] = [];
let formDidNotEditValue = {};

export function setFormDidNotEditValue(obj) {
  // TODO
}
export function getFormDidNotEditValue() {
  return formdidNotEditAttrs;
}

// 这个函数生成了一个默认的属性集合
((schema) => {
  _.forIn(schema, (value, key) => {
    if (value.type === 'object' || value.type === 'array' || value.oneOf || value.anyOf || value.allOf) {
      // TODO: 由于我们不对对象进行处理，因此我们并不需要进行递归生成属性
      // 这个函数保留到将来需要对对象进行可视化处理的时候使用
      // createDefaultSchema(value);
      formdidNotEditAttrs.push(key);
    }
    DefaultSchema[key] = value.default;
  });
})(ICESchema.properties);

export function isEqual(obj1, obj2) {
  return _.isEqual(obj1, obj2);
}

// 将默认值从配置文件中分离出来, 并加入表格不能编辑的值。
export function postSettingToExtension(currentConfig) {
  const userConfig = {};

  // // 测试保留的 EditValue
  // console.log('useformDidNotEditValue', JSON.stringify(formDidNotEditValue));

  _.forIn(currentConfig, (value, key) => {
    if (formdidNotEditAttrs.includes(key)) {
      if (formDidNotEditValue[key] !== undefined) {
        userConfig[key] = formDidNotEditValue[key];
      }
    } else if (!_.isEqual(currentConfig[key], DefaultSchema[key])) {
      userConfig[key] = value;
    }
  });
  return userConfig;
}

// 对上传的内容进行处理，储存不能编辑的值。
export function getSettingFromExtension(userSetting) {
  // console.log('userSetting',userSetting);
  // console.log('formdidNotEditAttrs',formdidNotEditAttrs);
  formDidNotEditValue = {};
  formdidNotEditAttrs.forEach((e) => {
    if (userSetting[e] !== undefined) {
      formDidNotEditValue[e] = userSetting[e];
    }
  });
  return userSetting;
}
