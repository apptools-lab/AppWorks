import { IDEKit } from '@ali/kit-runner';
import { activate as uiBuilderActivate } from '@ali/ide-extensions-iceworks-ui-builder';
import { activate as projectActivate } from '@ali/ide-extensions-iceworks-project-creator';

export default class KitNode extends IDEKit.IKitNodeBase {
  activate(context) {
    uiBuilderActivate(context);
    projectActivate(context);
  }

  deactivate() {
  }
}
