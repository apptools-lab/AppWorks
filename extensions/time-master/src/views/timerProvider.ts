import {
  TreeDataProvider,
  TreeItem,
  // commands,
  TreeItemCollapsibleState,
  EventEmitter,
  Event,
  TreeView,
  window,
  Uri,
  ExtensionContext,
} from 'vscode';
import * as moment from 'moment';
import * as numeral from 'numeral';
import { getUserSummary, UserSummary } from '../storages/user';
import { getFilesSummary, FileSummary } from '../storages/file';
import { humanizeMinutes, seconds2minutes } from '../utils/time';
import i18n from '../i18n';
import { getGlobalSummary, GlobalSummary } from '../storages/global';
import { AverageSummary, getAverageSummary } from '../storages/average';
import logger from '../utils/logger';
import { recordDAU } from '@appworks/recorder';
import recorder from '../utils/recorder';

const NUMBER_FORMAT = '0 a';
const timerCollapsedStateMap: {[key: string]: TreeItemCollapsibleState} = {};

class TimerItem {
  id = '';

  label = '';

  description = '';

  tooltip = '';

  command;

  contextValue = '';

  icon = '';

  children: TimerItem[] = [];

  initialCollapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Collapsed;
}

class TimerTreeItem extends TreeItem {
  constructor(
    private readonly treeItem: TimerItem,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly extensionContext: ExtensionContext,
  ) {
    super(treeItem.label, collapsibleState);

    const { lightPath, darkPath } = this.getTreeItemIcon(treeItem);

    if (treeItem.command) {
      this.command = treeItem.command;
    }
    if (treeItem.description) {
      this.description = treeItem.description;
    }

    if (lightPath && darkPath) {
      // @ts-ignore
      this.iconPath.light = lightPath;
      // @ts-ignore
      this.iconPath.dark = darkPath;
    } else {
      // no matching tag, remove the tree item icon path
      delete this.iconPath;
    }

    this.contextValue = this.getTreeItemContextValue(treeItem);
  }

  iconPath = {
    light: '',
    dark: '',
  };

  contextValue = 'treeItem';

  getTreeItemIcon(treeItem: TimerItem) {
    const iconName = treeItem.icon;
    const lightPath =
      iconName ?
        Uri.file(this.extensionContext.asAbsolutePath(`assets/light/${iconName}`)) :
        null;
    const darkPath =
      iconName ?
        Uri.file(this.extensionContext.asAbsolutePath(`assets/dark/${iconName}`)) :
        null;
    return { lightPath, darkPath };
  }

  getTreeItemContextValue(treeItem: TimerItem): string {
    if (treeItem.contextValue) {
      return treeItem.contextValue;
    }
    if (treeItem.children.length) {
      return 'parent';
    }
    return 'child';
  }
}

export class TimerProvider implements TreeDataProvider<TimerItem> {
  private _onDidChangeTreeData: EventEmitter<TimerItem | undefined> = new EventEmitter<TimerItem | undefined>();

  readonly onDidChangeTreeData: Event<TimerItem | undefined> = this._onDidChangeTreeData.event;

  private view: TreeView<TimerItem>;

  private readonly extensionContext: ExtensionContext;

  constructor(extensionContext: ExtensionContext) {
    this.extensionContext = extensionContext;
  }

  public refresh(): void {
    this._onDidChangeTreeData.fire(null);
  }

  public refreshParent(parent: TimerItem) {
    this._onDidChangeTreeData.fire(parent);
  }

  public async revealTreeView() {
    if (this.view) {
      const item = this.buildViewUserSummaryItem();
      try {
        this.view.reveal(item, {
          focus: true,
          select: false,
        });
      } catch (e) {
        logger.error(`[TimerProvider][revealTreeView] Unable to select tree item: ${e.message}`);
      }
    }
  }

  public bindView(treeView: TreeView<TimerItem>): void {
    this.view = treeView;
  }

  public getParent(): undefined {
    return undefined;
  }

  public getTreeItem(p: TimerItem): TimerTreeItem {
    let treeItem = null;
    if (p.children.length) {
      const collapsedState = timerCollapsedStateMap[p.label];
      if (!collapsedState) {
        treeItem = new TimerTreeItem(p, p.initialCollapsibleState, this.extensionContext);
      } else {
        treeItem = new TimerTreeItem(p, collapsedState, this.extensionContext);
      }
    } else {
      treeItem = new TimerTreeItem(p, TreeItemCollapsibleState.None, this.extensionContext);
    }
    return treeItem;
  }

  public async getChildren(element?: TimerItem): Promise<TimerItem[]> {
    let timerItems: TimerItem[] = [];
    if (element) {
      // return the children of this element
      timerItems = element.children;
    } else {
      // return the parent elements
      timerItems = [
        this.buildViewUserSummaryItem(),
        this.buildViewProjectSummaryItem(),
        this.buildDividerItem(),
        ...await this.getTreeParents(),
      ];
    }
    return timerItems;
  }

  private buildParentItem(
    label: string,
    tooltip: string,
    children: TimerItem[],
  ) {
    const item: TimerItem = new TimerItem();
    item.label = label;
    item.tooltip = tooltip;
    item.id = `${label}_title`;
    item.contextValue = 'title_item';
    item.children = children;
    return item;
  }

  private buildMessageItem(
    label: string,
    tooltip = '',
    command: string = null,
    commandArgs: any[] = null,
    icon: string = null,
  ) {
    const item: TimerItem = new TimerItem();
    item.label = label;
    item.tooltip = tooltip;
    item.id = `${label}_message`;
    item.contextValue = 'message_item';
    item.icon = icon;
    item.command = command ? {
      command,
      title: label,
      arguments: commandArgs,
    } : null;
    return item;
  }

  private buildActionItem(
    label: string,
    tooltip: string,
    command: string,
    commandArgs: any[] = null,
    icon = '',
  ): TimerItem {
    const item = new TimerItem();
    item.label = label;
    item.tooltip = tooltip;
    item.id = label;
    item.contextValue = 'action_button';
    item.command = command ? {
      command,
      title: label,
      arguments: commandArgs,
    } : null;
    item.icon = icon;
    return item;
  }

  private buildFileChangedItem(filesSummary: FileSummary[]): TimerItem {
    const parentItem = this.buildMessageItem(
      i18n.format('extension.timeMaster.tree.item.filesChanged.label'),
      i18n.format('extension.timeMaster.tree.item.filesChanged.detail'),
      null,
      null,
      null,
    );
    const childItem = this.buildMessageItem(i18n.format('extension.timeMaster.tree.item.today', { value: filesSummary.length }));
    parentItem.children = [childItem];
    return parentItem;
  }

  private buildHighestKpmFileItem(filesSummary: FileSummary[]): TimerItem {
    if (!filesSummary || filesSummary.length === 0) {
      return null;
    }
    const sortedArray = filesSummary.sort(
      (a: FileSummary, b: FileSummary) => b.kpm - a.kpm,
    );
    const highKpmChildren: TimerItem[] = [];
    const len = Math.min(3, sortedArray.length);
    for (let i = 0; i < len; i++) {
      const { fileName } = sortedArray[i];
      const kpm = sortedArray[i].kpm || 0;
      const kpmStr = kpm.toFixed(2);
      const label = `${fileName} | ${kpmStr}`;
      const messageItem = this.buildMessageItem(
        label,
        '',
        'appworks-time-master.openFileInEditor',
        [sortedArray[i].fsPath],
        null,
      );
      highKpmChildren.push(messageItem);
    }
    const highKpmParent = this.buildParentItem(
      i18n.format('extension.timeMaster.tree.item.topFilesByKPM.label'),
      i18n.format('extension.timeMaster.tree.item.topFilesByKPM.detail'),
      highKpmChildren,
    );
    return highKpmParent;
  }

  private buildMostEditedFileItem(filesSummary: FileSummary[]): TimerItem {
    if (!filesSummary || filesSummary.length === 0) {
      return null;
    }
    const sortedArray = filesSummary.sort(
      (a: FileSummary, b: FileSummary) => b.keystrokes - a.keystrokes,
    );
    const mostEditedChildren: TimerItem[] = [];
    const len = Math.min(3, sortedArray.length);
    for (let i = 0; i < len; i++) {
      const { fileName } = sortedArray[i];
      const keystrokes = sortedArray[i].keystrokes || 0;
      const keystrokesStr = numeral(keystrokes).format(NUMBER_FORMAT);
      const label = `${fileName} | ${keystrokesStr}`;
      const messageItem = this.buildMessageItem(
        label,
        '',
        'appworks-time-master.openFileInEditor',
        [sortedArray[i].fsPath],
        null,
      );
      mostEditedChildren.push(messageItem);
    }
    const mostEditedParent = this.buildParentItem(
      i18n.format('extension.timeMaster.tree.item.topFilesByKey.label'),
      i18n.format('extension.timeMaster.tree.item.topFilesByKey.detail'),
      mostEditedChildren,
    );
    return mostEditedParent;
  }

  private buildLongestFileCodeTimeItem(filesSummary: FileSummary[]): TimerItem {
    if (!filesSummary || filesSummary.length === 0) {
      return null;
    }
    const sortedArray = filesSummary.sort(
      (a: FileSummary, b: FileSummary) => b.sessionSeconds - a.sessionSeconds,
    );
    const longestCodeTimeChildren: TimerItem[] = [];
    const len = Math.min(3, sortedArray.length);
    for (let i = 0; i < len; i++) {
      const { fileName } = sortedArray[i];
      const durationMinutes = seconds2minutes(sortedArray[i].sessionSeconds);
      const codeHours = humanizeMinutes(durationMinutes);
      const label = `${fileName} | ${codeHours}`;
      const messageItem = this.buildMessageItem(
        label,
        '',
        'appworks-time-master.openFileInEditor',
        [sortedArray[i].fsPath],
        null,
      );
      longestCodeTimeChildren.push(messageItem);
    }
    const longestCodeTimeParent = this.buildParentItem(
      i18n.format('extension.timeMaster.tree.item.topFilesByCT.label'),
      i18n.format('extension.timeMaster.tree.item.topFilesByCT.detail'),
      longestCodeTimeChildren,
    );
    return longestCodeTimeParent;
  }

  private buildUserSummaryItem(
    label: string,
    tooltip: string,
    values: Array<{label?: string;tooltip?: string;icon?: string}>,
    collapsibleState: TreeItemCollapsibleState = null,
  ) {
    const parent: TimerItem = this.buildMessageItem(label, tooltip, null, null, null);
    values.forEach(({ label: vLabel, tooltip: vTooltip, icon: vIcon }) => {
      const child = this.buildMessageItem(vLabel, vTooltip, null, null, vIcon);
      parent.children.push(child);
    });
    if (collapsibleState) {
      parent.initialCollapsibleState = collapsibleState;
    }
    return parent;
  }

  private getUserSummaryItems(userSummary: UserSummary, globalSummary: GlobalSummary, averageSummary: AverageSummary): TimerItem[] {
    const {
      sessionSeconds,
      editorSeconds,
      linesAdded,
      linesRemoved,
      keystrokes,
    } = userSummary;
    const {
      dailySessionSeconds: globalDailySessionSeconds,
      dailyEditorSeconds: globalDailyEditorSeconds,
      dailyKeystrokes: globalDailyLinesAdded,
      dailyLinesAdded: globalDailyLinesRemoved,
      dailyLinesRemoved: globalDailyKeystrokes,
    } = globalSummary;
    const {
      dailySessionSeconds: averageDailySessionSeconds,
      dailyEditorSeconds: averageDailyEditorSeconds,
      dailyKeystrokes: averageDailyLinesAdded,
      dailyLinesAdded: averageDailyLinesRemoved,
      dailyLinesRemoved: averageDailyKeystrokes,
    } = averageSummary;
    const items: TimerItem[] = [];
    const dayStr = moment().format('ddd');

    // Editor time
    const etValues = [];
    const editorMinutes = seconds2minutes(editorSeconds);
    const editorMinutesStr = humanizeMinutes(editorMinutes);
    etValues.push({ label: i18n.format('extension.timeMaster.tree.item.today', { value: editorMinutesStr }), icon: 'rocket.svg' });
    if (averageDailyEditorSeconds) {
      const averageDailyEditorMinutes = seconds2minutes(averageDailyEditorSeconds);
      const avgEtMinStr = humanizeMinutes(averageDailyEditorMinutes);
      const editorLightningBolt = editorMinutes > averageDailyEditorMinutes ? 'bolt.svg' : 'bolt-grey.svg';
      etValues.push({
        label: i18n.format('extension.timeMaster.tree.item.average', { day: dayStr, value: avgEtMinStr }),
        icon: editorLightningBolt,
      });
    }
    if (globalDailyEditorSeconds) {
      const globalDailyEditorMinutes = seconds2minutes(globalDailyEditorSeconds);
      const globalEditorMinutesStr = humanizeMinutes(globalDailyEditorMinutes);
      etValues.push({
        label: i18n.format('extension.timeMaster.tree.item.global', { day: dayStr, value: globalEditorMinutesStr }),
        icon: 'global-grey.svg',
      });
    }
    items.push(
      this.buildUserSummaryItem(
        i18n.format('extension.timeMaster.tree.item.editor.label'),
        i18n.format('extension.timeMaster.tree.item.editor.detail'),
        etValues,
        TreeItemCollapsibleState.Expanded,
      ),
    );

    // Active code time
    const actValues = [];
    const sessionMinutes = seconds2minutes(sessionSeconds);
    const sessionMinutesStr = humanizeMinutes(sessionMinutes);
    actValues.push({ label: i18n.format('extension.timeMaster.tree.item.today', { value: sessionMinutesStr }), icon: 'rocket.svg' });
    if (averageDailySessionSeconds) {
      const averageDailySessionMinutes = seconds2minutes(averageDailySessionSeconds);
      const avgMinStr = humanizeMinutes(averageDailySessionMinutes);
      const activityLightningBolt = sessionMinutes > averageDailySessionMinutes ? 'bolt.svg' : 'bolt-grey.svg';
      actValues.push({
        label: i18n.format('extension.timeMaster.tree.item.average', { day: dayStr, value: avgMinStr }),
        icon: activityLightningBolt,
      });
    }
    if (globalDailySessionSeconds) {
      const globalDailySessionMinutes = seconds2minutes(globalDailySessionSeconds);
      const globalMinutesStr = humanizeMinutes(globalDailySessionMinutes);
      actValues.push({
        label: i18n.format('extension.timeMaster.tree.item.global', { day: dayStr, value: globalMinutesStr }),
        icon: 'global-grey.svg',
      });
    }
    items.push(
      this.buildUserSummaryItem(
        i18n.format('extension.timeMaster.tree.item.acCode.label'),
        i18n.format('extension.timeMaster.tree.item.acCode.detail'),
        actValues,
        TreeItemCollapsibleState.Expanded,
      ),
    );

    // Lines added
    const laValues = [];
    const currLinesAdded = numeral(linesAdded).format(NUMBER_FORMAT);
    laValues.push({ label: i18n.format('extension.timeMaster.tree.item.today', { value: currLinesAdded }), icon: 'rocket.svg' });
    if (averageDailyLinesAdded) {
      const userLinesAddedAvg = numeral(averageDailyLinesAdded).format(NUMBER_FORMAT);
      const linesAddedLightningBolt = linesAdded > averageDailyLinesAdded ? 'bolt.svg' : 'bolt-grey.svg';
      laValues.push({
        label: i18n.format('extension.timeMaster.tree.item.average', { day: dayStr, value: userLinesAddedAvg }),
        icon: linesAddedLightningBolt,
      });
    }
    if (globalDailyLinesAdded) {
      const globalLinesAdded = numeral(globalDailyLinesAdded).format(NUMBER_FORMAT);
      laValues.push({
        label: i18n.format('extension.timeMaster.tree.item.global', { day: dayStr, value: globalLinesAdded }),
        icon: 'global-grey.svg',
      });
    }
    items.push(this.buildUserSummaryItem(
      i18n.format('extension.timeMaster.tree.item.linesAdded.label'),
      i18n.format('extension.timeMaster.tree.item.linesAdded.detail'),
      laValues,
      TreeItemCollapsibleState.Collapsed,
    ));

    // Lines removed
    const lrValues = [];
    const currLinesRemoved = numeral(linesRemoved).format(NUMBER_FORMAT);
    lrValues.push({ label: i18n.format('extension.timeMaster.tree.item.today', { value: currLinesRemoved }), icon: 'rocket.svg' });
    if (averageDailyLinesRemoved) {
      const userLinesRemovedAvg = numeral(averageDailyLinesRemoved).format(NUMBER_FORMAT);
      const linesRemovedLightningBolt = linesRemoved > averageDailyLinesRemoved ? 'bolt.svg' : 'bolt-grey.svg';
      lrValues.push({
        label: i18n.format('extension.timeMaster.tree.item.average', { day: dayStr, value: userLinesRemovedAvg }),
        icon: linesRemovedLightningBolt,
      });
    }
    if (globalDailyLinesRemoved) {
      const globalLinesRemoved = numeral(globalDailyLinesRemoved).format(NUMBER_FORMAT);
      lrValues.push({
        label: i18n.format('extension.timeMaster.tree.item.global', { day: dayStr, value: globalLinesRemoved }),
        icon: 'global-grey.svg',
      });
    }
    items.push(this.buildUserSummaryItem(
      i18n.format('extension.timeMaster.tree.item.linesRemoved.label'),
      i18n.format('extension.timeMaster.tree.item.linesRemoved.detail'),
      lrValues,
      TreeItemCollapsibleState.Collapsed,
    ));

    // Keystrokes
    const kValues = [];
    const currKeystrokes = numeral(keystrokes).format(NUMBER_FORMAT);
    kValues.push({ label: i18n.format('extension.timeMaster.tree.item.today', { value: currKeystrokes }), icon: 'rocket.svg' });
    if (averageDailyKeystrokes) {
      const userKeystrokesAvg = numeral(averageDailyKeystrokes).format(NUMBER_FORMAT);
      const keystrokesLightningBolt = keystrokes > averageDailyKeystrokes ? 'bolt.svg' : 'bolt-grey.svg';
      kValues.push({
        label: i18n.format('extension.timeMaster.tree.item.average', { day: dayStr, value: userKeystrokesAvg }),
        icon: keystrokesLightningBolt,
      });
    }
    if (globalDailyKeystrokes) {
      const globalKeystrokes = numeral(globalDailyKeystrokes).format(NUMBER_FORMAT);
      kValues.push({
        label: i18n.format('extension.timeMaster.tree.item.global', { day: dayStr, value: globalKeystrokes }),
        icon: 'global-grey.svg',
      });
    }
    items.push(this.buildUserSummaryItem(
      i18n.format('extension.timeMaster.tree.item.keystrokes.label'),
      i18n.format('extension.timeMaster.tree.item.keystrokes.detail'),
      kValues,
      TreeItemCollapsibleState.Collapsed,
    ));

    return items;
  }

  private buildDividerItem() {
    const item = this.buildActionItem('', '', '', null, 'blue-line-96.png');
    return item;
  }

  private buildViewProjectSummaryItem() {
    const item = this.buildActionItem(
      i18n.format('extension.timeMaster.viewProjectSummary.label'),
      i18n.format('extension.timeMaster.viewProjectSummary.detail'),
      'appworks-time-master.generateProjectSummaryReport',
      null,
      'folder.svg',
    );
    return item;
  }

  private buildViewUserSummaryItem() {
    const item = this.buildActionItem(
      i18n.format('extension.timeMaster.viewUserSummary.label'),
      i18n.format('extension.timeMaster.viewUserSummary.detail'),
      'appworks-time-master.generateUserSummaryReport',
      null,
      'dashboard.svg',
    );
    return item;
  }

  private async getTreeParents(): Promise<TimerItem[]> {
    const treeItems: TimerItem[] = [];
    const userSummary: UserSummary = await getUserSummary();
    const globalSummary: GlobalSummary = await getGlobalSummary();
    const averageSummary: AverageSummary = await getAverageSummary();
    const originFilesChangeSummary = await getFilesSummary();

    const userSummaryItems: TimerItem[] = this.getUserSummaryItems(userSummary, globalSummary, averageSummary);

    // show the metrics per line
    treeItems.push(...userSummaryItems);

    // show the files changed metric
    const filesChanged = originFilesChangeSummary ? Object.keys(originFilesChangeSummary).length : 0;
    if (filesChanged > 0) {
      const filesSummary = Object.keys(originFilesChangeSummary).map((key) => originFilesChangeSummary[key]);

      const fileChangedParent = this.buildFileChangedItem(filesSummary);
      treeItems.push(fileChangedParent);

      const highKpmParent = this.buildHighestKpmFileItem(filesSummary);
      if (highKpmParent) {
        treeItems.push(highKpmParent);
      }

      const mostEditedFileParent = this.buildMostEditedFileItem(filesSummary);
      if (mostEditedFileParent) {
        treeItems.push(mostEditedFileParent);
      }

      const longestCodeTimeParent = this.buildLongestFileCodeTimeItem(filesSummary);
      if (longestCodeTimeParent) {
        treeItems.push(longestCodeTimeParent);
      }
    }

    return treeItems;
  }
}

// TODO now just using TreeItem `command` field to achieve this feature
// function handleTimerChangeSelection(view: TreeView<TimerItem>, item: TimerItem) {
//   if (item.command) {
//     const args = item.commandArgs || [];
//     if (args.length) {
//       commands.executeCommand(item.command, ...args);
//     } else {
//       commands.executeCommand(item.command, item);
//     }
//   }

//   // deselect it
//   try {
//     view.reveal(item, {
//       focus: false,
//       select: false,
//     });
//   } catch (e) {
//     logger.error(`[TimerProvider][handleTimerChangeSelection]Unable to deselect track: ${e.message}`);
//   }
// }

export function createTimerTreeView(timerProvider: TimerProvider) {
  const treeView = window.createTreeView('timeMaster', {
    treeDataProvider: timerProvider,
    showCollapseAll: false,
  });
  treeView.onDidCollapseElement(async e => {
    const item: TimerItem = e.element;
    timerCollapsedStateMap[item.label] = TreeItemCollapsibleState.Collapsed;
  });
  treeView.onDidExpandElement(async e => {
    const item: TimerItem = e.element;
    timerCollapsedStateMap[item.label] = TreeItemCollapsibleState.Expanded;
  });
  treeView.onDidChangeVisibility(({ visible }) => {
    if (visible) {
      recordDAU();
      recorder.record({
        module: 'treeView',
        action: 'visible',
      });
    }

    recorder.record({
      module: 'treeView',
      action: 'active',
    });
  });
  // treeView.onDidChangeSelection(async e => {
  //   if (!e.selection || e.selection.length === 0) {
  //     return;
  //   }
  //   const item: TimerItem = e.selection[0];
  //   handleTimerChangeSelection(treeView, item);
  // });
  return treeView;
}
