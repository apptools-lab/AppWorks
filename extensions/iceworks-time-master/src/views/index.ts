import { extensions, Memento, workspace, ConfigurationChangeEvent } from 'vscode';
import { checkIsO2, saveDataToSettingJson } from '@iceworks/common-service';
import { CONFIG_KEY_ICEWORKS_ENABLE_VIEWS, CONFIG_KEY_SECTION_ENABLE_VIEWS } from '../constants';

export * from './timerProvider';
export * from './timerStatusBar';

function checkIsAutoDisableViews(): boolean {
  const isO2 = checkIsO2();
  const hasIceworksKit = extensions.getExtension('O2.icework-kit');
  const isDisableView = !!(isO2 && hasIceworksKit);
  return isDisableView;
}

const didSetEnableViewsStateKey = 'iceworks.timeMaster.enableViews';
export function autoSetEnableViews(globalState: Memento) {
  const enableViewsIsSet = globalState.get(didSetEnableViewsStateKey);
  if (!enableViewsIsSet) {
    const isAutoDisableViews = checkIsAutoDisableViews();
    if (isAutoDisableViews) {
      saveDataToSettingJson(CONFIG_KEY_SECTION_ENABLE_VIEWS, false);
    }

    workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
      const isTrue = event.affectsConfiguration(CONFIG_KEY_ICEWORKS_ENABLE_VIEWS);
      if (isTrue) {
        globalState.update(didSetEnableViewsStateKey, true);
      }
    });
  }
}
