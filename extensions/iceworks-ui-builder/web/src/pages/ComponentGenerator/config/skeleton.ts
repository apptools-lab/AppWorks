/* eslint-disable */
import componentList from './componentList';
import componentsMap from './componentsMap';
import { vscode } from '@iceworks/vscode-webview/lib/webview';
import callService from '../../../callService';

//@ts-ignore
window.vscode = vscode;

export default {
  constants: {
    namespace: 'page',
    locale: 'zh-CN',
  },
  addons: {
    topArea: [
      {
        addonKey: 'logo',
        type: 'Custom',
        props: {
          width: 110,
          align: 'left',
        },
      },
      {
        addonKey: 'designMode',
        type: 'Custom',
        props: {
          align: 'right',
          width: 144,
        },
      },
      {
        addonKey: 'divider',
        type: 'Divider',
        props: {
          align: 'right',
        },
      },
      {
        addonKey: 'undoRedo',
        type: 'Custom',
        props: {
          align: 'right',
          width: 88,
        },
      },
      {
        addonKey: 'refresh',
        type: 'Icon',
        props: {
          align: 'right',
          icon: 'shuaxin',
          title: '刷新',
          onClick(appHelper) {
            appHelper.emit('ide.reset');
          },
        },
      },
      {
        addonKey: 'divider',
        type: 'Divider',
        props: {
          align: 'right',
        },
      },
      {
        addonKey: 'generateCode',
        type: 'Custom',
        props: {
          align: 'right',
          width: 86,
        },
        addonProps: {
          onClick: async (version, componentsMap, componentsTree) => {
            try {
              const utils = this.appHelper.uitls;
              const i18n = this.appHelper.i18n;
              console.log('utils ==>', utils, '18n ==>', i18n);
              await callService('component', 'generateComponentCode', version, componentsMap, utils, componentsTree, i18n);
            } catch (err) {
              console.error(err);
            }
          }
        },
      },
      {
        addonKey: 'preview',
        type: 'Custom',
        props: {
          align: 'right',
          width: 86,
        },
      },
    ],
    leftArea: [
      {
        addonKey: 'componentTree',
        type: 'PanelIcon',
        props: {
          align: 'top',
          icon: 'shuxingkongjian',
          title: '组件树',
          panelProps: {
            minWidth: 100,
            maxWidth: 500,
          },
        },
      },
      {
        addonKey: 'componentList',
        type: 'PanelIcon',
        props: {
          align: 'top',
          icon: 'zujianku',
          title: '组件库',
        },
        addonProps: {
          disableAppComponent: true,
        },
      },
    ],
    rightArea: [
      {
        addonKey: 'componentStyle',
        props: {
          title: '样式',
        },
      },
      {
        addonKey: 'componentAttr',
        props: {
          title: '属性',
        },
      }
    ],
    centerArea: [
      {
        addonKey: 'canvas',
      },
    ],
  },
  hooks: [
    {
      message: 'canvas.ready',
      type: 'once',
      handler(appHelper) {
        // 获取当前编辑实体的style字段，如果有需要进行scss编译并通过style.update消息通知画布生效
        const entityStyle = appHelper.entityInfo.style;
        if (entityStyle) {
          appHelper.utils.transformToCss(entityStyle).then((res) => {
            appHelper.entityInfo.css = res;
            appHelper.emit('style.update');
          });
        }
        // 获取当前编辑schema中容器组件的scss配置，如果有需要进行scss编译并通过style.update消息通知画布生效
        const blockSchemaMap = appHelper.schemaHelper.blockSchemaMap || {};
        const scssMap = {};
        Object.keys(blockSchemaMap).forEach((key) => {
          const item = blockSchemaMap[key];
          if (item.scss && item.__ctx) {
            scssMap[item.__ctx.lunaKey] = item.scss;
          }
        });
        appHelper.utils.transformToCss(scssMap).then((res) => {
          Object.keys(res).forEach((key) => {
            blockSchemaMap[key].__ctx.css = res[key];
          });
          appHelper.emit('style.update');
        });
      },
    },
    {
      message: 'schemaHelper.schema.afterUpdate',
      type: 'on',
      handler(appHelper) {
        console.log(`${appHelper.constants.namespace}[${appHelper.utils.getTime()}]: schema change`);
      },
    },
  ],
  shortCuts: [
    {
      keyboard: 'command+a',
      handler(ev, appHelper) {
        alert('command+a');
      },
    },
    {
      keyboard: 'command+shift+a',
      handler(ev, appHelper) {
        // 切换设计模式
        appHelper.emit('designMode.toggle');
      },
    },
  ],
  extensions: {
    init(appHelper) {
      appHelper.set({
        entityInfo: {},
        componentMaterial: {
          library: [
            {
              name: '基础组件库',
              id: 1,
            },
          ],
          list: componentList,
        },
        componentsMap,
      });
      appHelper.emit('schema.reset', {
        componentName: 'Block',
        fileName: 'index',
        props: {},
        children: [],
      });
    },
    destroy(appHelper) { },
  },
};
