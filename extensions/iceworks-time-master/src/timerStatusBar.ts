import { window, StatusBarAlignment, StatusBarItem } from 'vscode';
import { getUserSummary } from './storages/user';
import { SECONDS_PER_MINUTE } from './constants';
import { humanizeMinutes } from './utils/common';

interface TimerStatusBar extends StatusBarItem {
  refresh(): void;
}

export function createTimerStatusBar() {
  const statusBar = window.createStatusBarItem(
    StatusBarAlignment.Right,
    10,
  ) as TimerStatusBar;
  statusBar.tooltip = 'Active code time today. Click to see more from Iceworks';
  statusBar.text = getStatusBarText();
  statusBar.command = 'iceworks-time-master.displayTimerTree';
  statusBar.refresh = function () {
    this.text = getStatusBarText();
  };
  return statusBar;
}

function getStatusBarText() {
  const { sessionSeconds, averageDailySessionSeconds } = getUserSummary();
  const inFlowIcon = averageDailySessionSeconds && sessionSeconds > averageDailySessionSeconds ? '$(rocket)' : '$(clock)';
  const minutesStr = humanizeMinutes(sessionSeconds / SECONDS_PER_MINUTE);
  const text = `${inFlowIcon} ${minutesStr}`;
  return text;
}