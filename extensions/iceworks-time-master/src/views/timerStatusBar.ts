import { window, StatusBarAlignment, StatusBarItem } from 'vscode';
import { getUserSummary } from '../storages/user';
import { humanizeMinutes, seconds2minutes } from '../utils/time';
import { getAverageSummary } from '../storages/average';

interface TimerStatusBar extends StatusBarItem {
  refresh(): Promise<void>;
}

export async function createTimerStatusBar() {
  const statusBar = window.createStatusBarItem(
    StatusBarAlignment.Right,
    10,
  ) as TimerStatusBar;
  statusBar.tooltip = 'Active code time today. Click to see more from Iceworks';
  statusBar.text = await getStatusBarText();
  statusBar.command = 'iceworks-time-master.displayTimerTree';
  statusBar.refresh = async function () {
    statusBar.text = await getStatusBarText();
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
