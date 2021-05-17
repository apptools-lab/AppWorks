import { window, StatusBarAlignment, StatusBarItem, workspace, ConfigurationChangeEvent } from 'vscode';
import { getUserSummary } from '../storages/user';
import { humanizeMinutes, seconds2minutes } from '../utils/time';
import { getAverageSummary } from '../storages/average';
import { CONFIG_KEY_ICEWORKS_ENABLE_STATUS_BAR, CONFIG_KEY_SECTION_ENABLE_STATUS_BAR } from '../constants';
import { getDataFromSettingJson } from '@appworks/common-service';

interface TimerStatusBar extends StatusBarItem {
  refresh(): Promise<void>;
  activate(): void;
}

export async function createTimerStatusBar() {
  const statusBar = window.createStatusBarItem(
    StatusBarAlignment.Right,
    10,
  ) as TimerStatusBar;
  statusBar.tooltip = 'Active code time today. Click to see more from AppWorks';
  statusBar.text = await getStatusBarText();
  statusBar.command = 'appworks-time-master.displayTimerTree';
  statusBar.refresh = async function () {
    statusBar.text = await getStatusBarText();
  };
  statusBar.activate = function () {
    const enableStatusBar = getDataFromSettingJson(CONFIG_KEY_SECTION_ENABLE_STATUS_BAR);
    if (enableStatusBar) {
      statusBar.show();
    }
    workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
      const isChanged = event.affectsConfiguration(CONFIG_KEY_ICEWORKS_ENABLE_STATUS_BAR);
      if (isChanged) {
        const newEnableStatusBar = getDataFromSettingJson(CONFIG_KEY_SECTION_ENABLE_STATUS_BAR);
        if (newEnableStatusBar) {
          statusBar.show();
        } else {
          statusBar.hide();
        }
      }
    });
  };
  return statusBar;
}

async function getStatusBarText() {
  const { editorSeconds } = await getUserSummary();
  const { dailyEditorSeconds } = await getAverageSummary();
  const inFlowIcon = dailyEditorSeconds && editorSeconds > dailyEditorSeconds ? '$(rocket)' : '$(clock)';
  const sessionMinutes = seconds2minutes(editorSeconds);
  const text = `${inFlowIcon} ${humanizeMinutes(sessionMinutes)}`;
  return text;
}
