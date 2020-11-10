import { activate as aliIdeExtensionsIceworksAppActive, deactivate as aliIdeExtensionsIceworksAppDeactivate } from '@ali/ide-extensions-iceworks-app';
import { activate as aliIdeExtensionsIceworksConfigHelperActive, deactivate as aliIdeExtensionsIceworksConfigHelperDeactivate } from '@ali/ide-extensions-iceworks-config-helper';
import { activate as aliIdeExtensionsIceworksMaterialHelperActive, deactivate as aliIdeExtensionsIceworksMaterialHelperDeactivate } from '@ali/ide-extensions-iceworks-material-helper';
import { activate as aliIdeExtensionsIceworksStyleHelperActive, deactivate as aliIdeExtensionsIceworksStyleHelperDeactivate } from '@ali/ide-extensions-iceworks-style-helper';
import { activate as aliIdeExtensionsIceworksProjectCreatorActive, deactivate as aliIdeExtensionsIceworksProjectCreatorDeactivate } from '@ali/ide-extensions-iceworks-project-creator';
// import { activate as aliIdeExtensionsIceworksDoctorActive, deactivate as aliIdeExtensionsIceworksDoctorDeactivate } from '@ali/ide-extensions-iceworks-doctor';
import { activate as aliIdeExtensionsIceworksUiBuilderActive, deactivate as aliIdeExtensionsIceworksUiBuilderDeactivate } from '@ali/ide-extensions-iceworks-ui-builder';
import { activate as defNodeActivate } from '@ali/publish-visual/out/node';
import { activate as defActivate } from '@ali/publish-visual';
import * as kaitian from 'kaitian';
import { IDEKit } from '@ali/kit-runner';

export default class KitNode implements IDEKit.IKitNodeBase {
  registerToolbarHandle(key: string, handle: kaitian.toolbar.IToolbarButtonActionHandle | kaitian.toolbar.IToolbarSelectActionHandle<string>) {
    this.toolbarHandles[key] = handle;
  }
  toolbarHandles: {[id: string]: kaitian.toolbar.IToolbarButtonActionHandle | kaitian.toolbar.IToolbarSelectActionHandle<string>} = {};

  activate(context) {
    aliIdeExtensionsIceworksAppActive(context);
    aliIdeExtensionsIceworksConfigHelperActive(context);
    aliIdeExtensionsIceworksMaterialHelperActive(context);
    aliIdeExtensionsIceworksStyleHelperActive(context);
    aliIdeExtensionsIceworksProjectCreatorActive(context);
    // aliIdeExtensionsIceworksDoctorActive(context);
    aliIdeExtensionsIceworksUiBuilderActive(context);
    defActivate(context);
    defNodeActivate(context);
  }

  deactivate() {
    aliIdeExtensionsIceworksAppDeactivate();
    aliIdeExtensionsIceworksConfigHelperDeactivate();
    aliIdeExtensionsIceworksMaterialHelperDeactivate();
    aliIdeExtensionsIceworksStyleHelperDeactivate();
    aliIdeExtensionsIceworksProjectCreatorDeactivate();
    // aliIdeExtensionsIceworksDoctorDeactivate();
    aliIdeExtensionsIceworksUiBuilderDeactivate();
  }

  async defPublish() {
    this.toolbarHandles['iceworks.def.publish'].setState('publishing', '发布中');
    const env = await kaitian.window.showQuickPick([
      {label: 'daily', description: '发布到日常环境'},
      {label: 'prod', description: '发布到线上环境'},
    ]);
    if (env) {
      // TODO: 底层插件应该暴露一个promise给套件
      await kaitian.commands.executeCommand('core.def.publish', env.label);
      this.toolbarHandles['iceworks.def.publish'].setState('default', 'DEF发布');
    }
  }
}
