import { commands, extensions, Memento, workspace, ConfigurationChangeEvent, window, WindowState } from 'vscode';
import { checkIsO2, saveDataToSettingJson } from '@appworks/common-service';
import { recordDAU } from '@appworks/recorder';
import { CONFIG_KEY_SECTION_ENABLE_VIEW, CONFIG_KEY_SECTION_ENABLE_STATUS_BAR, CONFIG_KEY_ICEWORKS_ENABLE_VIEW, CONFIG_KEY_ICEWORKS_ENABLE_STATUS_BAR } from '../constants';
import logger from '../utils/logger';
import { createTimerTreeView, TimerProvider } from './timerProvider';
import { createTimerStatusBar } from './timerStatusBar';
import recorder from '../utils/recorder';

function checkIsDisableViews(): boolean {
  const isO2 = checkIsO2();
  const hasIceworksKit = extensions.getExtension('O2.icework-kit');
  const isDisableViews = isO2 && !hasIceworksKit;
  return isDisableViews;
}

const didManualSetEnableViewStateKey = 'appworks.timeMaster.enableView';
const didManualSetEnableStatusBarStateKey = 'appworks.timeMaster.enableStatusBar';
function autoSetEnableViewsConfig(globalState: Memento) {
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

export function refreshViews() {
  logger.debug('[walkClock][refreshViews] run');
  commands.executeCommand('appworks-time-master.refreshTimerTree');
  commands.executeCommand('appworks-time-master.refreshTimerStatusBar');
}

export async function init(context) {
  const { subscriptions, globalState } = context;
  autoSetEnableViewsConfig(globalState);

  // create views
  const timerProvider = new TimerProvider(context);
  const timerTreeView = createTimerTreeView(timerProvider);
  timerProvider.bindView(timerTreeView);

  const timerStatusBar = await createTimerStatusBar();
  timerStatusBar.activate();

  subscriptions.push(
    commands.registerCommand('appworks-time-master.refreshTimerTree', () => {
      timerProvider.refresh();
    }),
    commands.registerCommand('appworks-time-master.refreshTimerStatusBar', () => {
      timerStatusBar.refresh();
    }),
    commands.registerCommand('appworks-time-master.displayTimerTree', () => {
      timerProvider.revealTreeView();
      recordDAU();
      recorder.record({
        module: 'command',
        action: 'displayTimerTree',
      });
    }),
  );

  window.onDidChangeWindowState((windowState: WindowState) => {
    if (windowState.focused) {
      refreshViews();
    }
  });
}
