import { UserSummary } from '../storages/user';
import { humanizeMinutes, seconds2minutes } from './time';

const DASHBOARD_LABEL_WIDTH = 28;
const DASHBOARD_VALUE_WIDTH = 36;
const DASHBOARD_SEPARATOR = ' :';
function getSpaces(spacesRequired: number) {
  let spaces = '';
  if (spacesRequired > 0) {
    for (let i = 0; i < spacesRequired; i++) {
      spaces += ' ';
    }
  }
  return spaces;
}
function getDashboardValue(value: string) {
  const spacesRequired = DASHBOARD_VALUE_WIDTH - value.length - 2;
  const spaces = getSpaces(spacesRequired);
  return `  ${spaces}${value}`;
}
function getDashboardLabel(label: string) {
  const spacesRequired = DASHBOARD_LABEL_WIDTH - label.length;
  const spaces = getSpaces(spacesRequired);
  return `${spaces}${label}`;
}

export function getDashboardHr() {
  let content = '';
  const dashLen = DASHBOARD_LABEL_WIDTH + DASHBOARD_VALUE_WIDTH + DASHBOARD_SEPARATOR.length;
  for (let i = 0; i < dashLen; i++) {
    content += '-';
  }
  content += '\n';
  return content;
}

export function getDashboardRow(label: string, value: string) {
  const dashboardLabel = getDashboardLabel(label);
  const dashboardValue = getDashboardValue(value);
  const content = `${dashboardLabel}${DASHBOARD_SEPARATOR}${dashboardValue}\n`;
  return content;
}

export function getRangeDashboard(title: string, userSummary: UserSummary) {
  const { sessionSeconds, linesAdded, linesRemoved, keystrokes } = userSummary;
  let str = `${title}\n`;
  const hrStr = getDashboardHr();
  str += hrStr;
  str += getDashboardRow(
    'Active code time',
    humanizeMinutes(seconds2minutes(sessionSeconds)),
  );
  str += getDashboardRow(
    'Lines of code added',
    linesAdded.toLocaleString(),
  );
  str += getDashboardRow(
    'Lines of code deleted',
    linesRemoved.toLocaleString(),
  );
  str += getDashboardRow(
    'Total keystrokes',
    keystrokes.toLocaleString(),
  );
  // str += getDashboardRow(
  //   'Characters added',
  //   '15,397',
  // );
  // str += getDashboardRow(
  //   'Characters deleted',
  //   '12,095',
  // );
  // str += getDashboardRow(
  //   'KPM',
  //   '10',
  // );
  // str += getDashboardRow(
  //   'Top language',
  //   'typescript',
  // );
  return str;
}
