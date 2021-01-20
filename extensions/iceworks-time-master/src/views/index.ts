import { extensions, Memento, workspace, ConfigurationChangeEvent } from 'vscode';
import { checkIsO2, saveDataToSettingJson } from '@iceworks/common-service';
import { CONFIG_KEY_ICEWORKS_ENABLE_VIEWS, CONFIG_KEY_SECTION } from '../constants';

export * from './timerProvider';
export * from './timerStatusBar';

function checkIsDisableViews(): boolean {
  const isO2 = checkIsO2();
  const hasIceworksKit = extensions.getExtension('O2.icework-kit');
  const isDisableViews = isO2 && !hasIceworksKit;
  return isDisableViews;
}

const didManualSetEnableViewsStateKey = 'iceworks.timeMaster.enableViews';
export function autoSetEnableViewsConfig(globalState: Memento) {
  const didManualSetEnableViews = globalState.get(didManualSetEnableViewsStateKey);
  if (!didManualSetEnableViews) {
    const isDisableViews = checkIsDisableViews();
    if (isDisableViews) {
      saveDataToSettingJson(CONFIG_KEY_SECTION, false);
    }

    workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
      const affectConfig = event.affectsConfiguration(CONFIG_KEY_ICEWORKS_ENABLE_VIEWS);
      if (affectConfig) {
        globalState.update(didManualSetEnableViewsStateKey, true);
      }
    });
  }
}
