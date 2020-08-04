import * as _ from 'lodash';
import testSchema from '../../schemas/rax.app.zh-cn.json';

// these props will not edit in web view
export const formdidNotEditAttrs: string[] = [];
export const DefaultSchema = {};

// 这个函数生成了一个默认的属性集合
export const initDefaultValue = (schema) => {
  _.forIn(schema.properties, (value, key) => {
    // eslint-disable-next-line dot-notation
    if (value['type'] === 'object' || value['type'] === 'array' || value['oneOf'] || value['anyOf'] || value['allOf']) {
      // TODO: 由于我们不对对象进行处理，因此我们并不需要进行递归生成属性
      // 这个函数保留到将来需要对对象进行可视化处理的时候使用
      // createDefaultSchema(value);
      formdidNotEditAttrs.push(key);
    }
    DefaultSchema[key] = value.default;
  });
};

export const syncJsonContentObj = {};

export function getSyncJsonContentObj() {
  return syncJsonContentObj;
}
export function getFormDidNotEditValue() {
  return formdidNotEditAttrs;
}

export function isEqual(obj1, obj2) {
  return _.isEqual(obj1, obj2);
}

// 将变化的内容同步给插件
export function getMessageForExtension(currentConfig) {
  const message = {};

  // 用户已设置的必须全部更新
  _.forIn(syncJsonContentObj, (value, key) => {
    if (!formdidNotEditAttrs.includes(key) && !_.isEqual(value, currentConfig[key])) {
      message[key] = currentConfig[key];
      syncJsonContentObj[key] = currentConfig[key];
    }
  });

  // 找到新增的属性
  _.forIn(currentConfig, (value, key) => {
    if ([...formdidNotEditAttrs, ...Object.keys(syncJsonContentObj)].includes(key)) {
      // change nothing
    } else if (DefaultSchema[key] !== undefined && !_.isEqual(currentConfig[key], DefaultSchema[key])) {
      console.log('new Props in sync', key);
      syncJsonContentObj[key] = value;
      message[key] = value;
    }
  });
  return Object.keys(message).length !== 0 ? message : undefined;
}

// 同步插件方面的 JSON 内容。
export function setIncreamentalUpdateFromExtension(userSetting) {
  if (!userSetting) {
    return;
  }

  _.forIn(userSetting, (value, key) => {
    if (value === null) {
      delete syncJsonContentObj[key];
    } else {
      syncJsonContentObj[key] = value;
    }
  });
  return syncJsonContentObj;
}

export function getVScode() {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  if (typeof acquireVsCodeApi === 'function') return acquireVsCodeApi();
  else {
    console.log('DevelopMethod');
    setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('message', false, true);
      event.data = {
        JsonContent: {},
        projectFramework: 'icejs',
        JsonFileName: 'build.json',
        locale: 'zh-cn',
        schema: testSchema,
        command: 'initWebview',
      };
      window.dispatchEvent(event);
    }, 1000);
    return {
      postMessage: (e) => {
        console.log('post', e, 'to vscode');
      },
    };
  }
}
