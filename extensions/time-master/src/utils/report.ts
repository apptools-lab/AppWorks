import * as vscode from 'vscode';
import { UserSummary } from '../storages/user';
import { humanizeMinutes, seconds2minutes } from './time';
import i18n from '../i18n';

const DASHBOARD_LABEL_WIDTH = 28;
const DASHBOARD_VALUE_WIDTH = 36;
const DASHBOARD_SEPARATOR = i18n.format('extension.timeMaster.separator');
function getSpaces(spacesRequired: number) {
  let spaces = '';
  if (spacesRequired > 0) {
    for (let i = 0; i < spacesRequired; i++) {
      spaces += ' ';
    }
  }
  return vscode.env.language.indexOf('en') > -1 ? spaces : '';
}
function getReportValue(value: string) {
  const spacesRequired = DASHBOARD_VALUE_WIDTH - value.length - 2;
  const spaces = getSpaces(spacesRequired);
  return `${spaces}${value}`;
}
function getReportLabel(label: string) {
  const spacesRequired = DASHBOARD_LABEL_WIDTH - label.length;
  const spaces = getSpaces(spacesRequired);
  return `${spaces}${label}`;
}

export function getReportHr() {
  let content = '';
  const dashLen = DASHBOARD_LABEL_WIDTH + DASHBOARD_VALUE_WIDTH + DASHBOARD_SEPARATOR.length;
  for (let i = 0; i < dashLen; i++) {
    content += '-';
  }
  content += '\n';
  return content;
}

export function getReportRow(label: string, value: string) {
  const reportLabel = getReportLabel(label);
  const reportValue = getReportValue(value);
  const content = `${reportLabel}${DASHBOARD_SEPARATOR}${reportValue}\n`;
  return content;
}

export function getRangeReport(userSummary: UserSummary, title?: string) {
  const { sessionSeconds = 0, editorSeconds = 0, linesAdded = 0, linesRemoved = 0, keystrokes = 0 } = userSummary;
  let str = '';
  if (title) {
    str += `${title}\n`;
    str += getReportHr();
  }
  str += getReportRow(
    i18n.format('extension.timeMaster.edTime'),
    humanizeMinutes(seconds2minutes(editorSeconds)),
  );
  str += getReportRow(
    i18n.format('extension.timeMaster.acCode'),
    humanizeMinutes(seconds2minutes(sessionSeconds)),
  );
  str += getReportRow(
    i18n.format('extension.timeMaster.linesAdded'),
    Number(linesAdded).toLocaleString(),
  );
  str += getReportRow(
    i18n.format('extension.timeMaster.linesRemoved'),
    Number(linesRemoved).toLocaleString(),
  );
  str += getReportRow(
    i18n.format('extension.timeMaster.keystrokes'),
    Number(keystrokes).toLocaleString(),
  );
  // str += getReportRow(
  //   'Characters added',
  //   '15,397',
  // );
  // str += getReportRow(
  //   'Characters deleted',
  //   '12,095',
  // );
  // str += getReportRow(
  //   'KPM',
  //   '10',
  // );
  // str += getReportRow(
  //   'Top language',
  //   'typescript',
  // );
  return str;
}
