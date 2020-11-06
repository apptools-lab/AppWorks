import { window, StatusBarAlignment, StatusBarItem } from 'vscode';
import { getUserSummary } from '../storages/user';
import { seconds2minutes } from '../utils/time';
import { getAverageSummary } from '../storages/average';

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
  const { sessionSeconds } = getUserSummary();
  const { dailySessionSeconds } = getAverageSummary();
  const inFlowIcon = dailySessionSeconds && sessionSeconds > dailySessionSeconds ? '$(rocket)' : '$(clock)';
  const minutesStr = seconds2minutes(sessionSeconds);
  const text = `${inFlowIcon} ${minutesStr}`;
  return text;
}
