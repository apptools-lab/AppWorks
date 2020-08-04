/* eslint-disable */
import { componentsMap, componentList } from '@ali/iceluna-config-example';

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
      {
        addonKey: 'schema',
        type: 'PanelIcon',
        props: {
          align: 'bottom',
          icon: 'ceshi',
          title: 'schema 源码开发',
          panelProps: {
            defaultWidth: 480,
          },
        },
      },
      {
        addonKey: 'style',
        type: 'PanelIcon',
        props: {
          align: 'bottom',
          icon: 'SCSS',
          title: 'scss 全局样式设置',
          panelProps: {
            defaultWidth: 480,
          },
        },
      },
      {
        addonKey: 'utils',
        type: 'PanelIcon',
        props: {
          align: 'bottom',
          icon: 'funcsgaiban',
          title: 'utils 全局公共函数设置',
          panelProps: {
            defaultWidth: 540,
          },
        },
      },
      {
        addonKey: 'constants',
        type: 'PanelIcon',
        props: {
          align: 'bottom',
          icon: 'constgaiban',
          title: 'constants 全局常量设置',
          panelProps: {
            defaultWidth: 480,
          },
        },
      },
      {
        addonKey: 'canvasSetting',
        type: 'PanelIcon',
        props: {
          align: 'bottom',
          icon: 'huabushezhi',
          title: 'canvas 画布配置',
          panelProps: {
            defaultWidth: 300,
          },
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
      },
      {
        addonKey: 'componentEvent',
        props: {
          title: '事件',
        },
      },
      {
        addonKey: 'componentData',
        props: {
          title: '数据',
        },
        addonProps: {
          disableDataSourceSelect: true,
        },
      },
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
        entityInfo: {
          style: 'div {color: #dd2727;}',
          constants: {
            name: 'World',
          },
          utils: [
            {
              name: 'Message',
              type: 'npm',
              content: {
                package: '@alife/next',
                version: '^1.17.12',
                destructuring: true,
                exportName: 'Message',
              },
            },
            {
              name: 'moment',
              type: 'npm',
              content: {
                package: 'moment',
                version: '^2.24.0',
              },
            },
            {
              name: 'test',
              type: 'function',
              content() {
                alert('test');
              },
            },
          ],
        },
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
        componentName: 'Page',
        fileName: 'index',
        props: {},
        children: [
          {
            componentName: 'Div',
            props: {},
            children: [
              {
                componentName: 'Text',
                props: {
                  text: '{{`hello ${this.constants.name}`}}',
                },
              },
            ],
          },
        ],
      });
    },
    destroy(appHelper) { },
  },
};
