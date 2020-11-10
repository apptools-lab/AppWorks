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

export default class KitNode {
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
    const env = await kaitian.window.showQuickPick([
      {label: 'daily', description: '发布到日常环境'},
      {label: 'prod', description: '发布到线上环境'},
    ]);
    if (env) {
      await kaitian.commands.executeCommand('core.def.publish', env.label);
    }
  }
}
