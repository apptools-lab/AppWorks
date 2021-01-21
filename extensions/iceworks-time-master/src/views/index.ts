import { extensions, Memento, workspace, ConfigurationChangeEvent } from 'vscode';
import { checkIsO2, saveDataToSettingJson } from '@iceworks/common-service';
import { CONFIG_KEY_SECTION_ENABLE_VIEW, CONFIG_KEY_SECTION_ENABLE_STATUS_BAR, CONFIG_KEY_ICEWORKS_ENABLE_VIEW, CONFIG_KEY_ICEWORKS_ENABLE_STATUS_BAR } from '../constants';

export * from './timerProvider';
export * from './timerStatusBar';

function checkIsDisableViews(): boolean {
  const isO2 = checkIsO2();
  const hasIceworksKit = extensions.getExtension('O2.icework-kit');
  const isDisableViews = isO2 && !hasIceworksKit;
  return isDisableViews;
}

const didManualSetEnableViewStateKey = 'iceworks.timeMaster.enableView';
const didManualSetEnableStatusBarStateKey = 'iceworks.timeMaster.enableStatusBar';
export function autoSetEnableViewsConfig(globalState: Memento) {
  const didManualSetEnableView = globalState.get(didManualSetEnableViewStateKey);
  if (!didManualSetEnableView) {
    const isDisableViews = checkIsDisableViews();
    if (isDisableViews) {
      saveDataToSettingJson(CONFIG_KEY_SECTION_ENABLE_VIEW, false);
    }
  }
  const didManualSetEnableStatusBar = globalState.get(didManualSetEnableStatusBarStateKey);
  if (!didManualSetEnableStatusBar) {
    const isDisableViews = checkIsDisableViews();
    if (isDisableViews) {
      saveDataToSettingJson(CONFIG_KEY_SECTION_ENABLE_STATUS_BAR, false);
    }
  }

  workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
    if (!didManualSetEnableView && event.affectsConfiguration(CONFIG_KEY_ICEWORKS_ENABLE_VIEW)) {
      globalState.update(didManualSetEnableViewStateKey, true);
    }
    if (!didManualSetEnableStatusBar && event.affectsConfiguration(CONFIG_KEY_ICEWORKS_ENABLE_STATUS_BAR)) {
      globalState.update(didManualSetEnableStatusBarStateKey, true);
    }
  });
}
