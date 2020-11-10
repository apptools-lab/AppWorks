import {
  TreeDataProvider,
  TreeItem,
  commands,
  Command,
  TreeItemCollapsibleState,
  EventEmitter,
  Event,
  TreeView,
  window,
} from 'vscode';
import * as path from 'path';
import * as moment from 'moment';
import * as numeral from 'numeral';
import { getUserSummary, UserSummary } from '../storages/user';
import { getFilesChangeSummary, FileChangeSummary } from '../storages/filesChange';
import { humanizeMinutes, seconds2minutes } from '../utils/time';
import i18n from '../i18n';
import { getGlobalSummary, GlobalSummary } from '../storages/global';
import { AverageSummary, getAverageSummary } from '../storages/average';

const NUMBER_FORMAT = '0 a';
const resourcePath = path.join(__dirname, '..', 'assets');
const timerCollapsedStateMap: {[key: string]: TreeItemCollapsibleState} = {};

enum UIInteractionType {
  Keyboard = 'keyboard',
  Click = 'click',
}

class TimerItem {
  id = '';

  label = '';

  description = '';

  value = '';

  tooltip = '';

  command = '';

  commandArgs: any[] = [];

  type = '';

  contextValue = '';

  callback: any = null;

  icon = '';

  children: TimerItem[] = [];

  color = '';

  location = '';

  name = '';

  eventDescription = '';

  initialCollapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.Collapsed;

  interactionType: UIInteractionType = UIInteractionType.Click;

  hideCTAInTracker = false;
}

class TimerTreeItem extends TreeItem {
  constructor(
    private readonly treeItem: TimerItem,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly command?: Command,
  ) {
    super(treeItem.label, collapsibleState);

    const { lightPath, darkPath } = this.getTreeItemIcon(treeItem);

    if (treeItem.description) {
      this.description = treeItem.description;
    }

    if (lightPath && darkPath) {
      this.iconPath.light = lightPath;
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

  getTreeItemIcon(treeItem: TimerItem): any {
    const iconName = treeItem.icon;
    const lightPath =
      iconName ? path.join(resourcePath, 'light', iconName) : null;
    const darkPath =
      iconName ? path.join(resourcePath, 'dark', iconName) : null;
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

function createTimerTreeItem(p: TimerItem, state: TreeItemCollapsibleState): TimerTreeItem {
  return new TimerTreeItem(p, state);
}

export class TimerProvider implements TreeDataProvider<TimerItem> {
  private _onDidChangeTreeData: EventEmitter<TimerItem | undefined> = new EventEmitter<TimerItem | undefined>();

  readonly onDidChangeTreeData: Event<TimerItem | undefined> = this._onDidChangeTreeData.event;

  private view: TreeView<TimerItem>;

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
      } catch (err) {
        console.error(`Unable to select tree item: ${err.message}`);
      }
    }
  }

  public bindView(treeView: TreeView<TimerItem>): void {
    this.view = treeView;
  }

  private buildParentItem(label: string, tooltip: string, children: TimerItem[], name = '', location = 'ct_metrics_tree') {
    const item: TimerItem = new TimerItem();
    item.label = label;
    item.tooltip = tooltip;
    item.id = `${label}_title`;
    item.contextValue = 'title_item';
    item.children = children;
    item.eventDescription = null;
    item.name = name;
    item.location = location;
    return item;
  }

  private buildMessageItem(label: string, tooltip = '', icon: string = null, command : string = null, commandArgs: any[] = null, name = '', location = '') {
    const item: TimerItem = new TimerItem();
    item.label = label;
    item.tooltip = tooltip;
    item.icon = icon;
    item.command = command;
    item.commandArgs = commandArgs;
    item.id = `${label}_message`;
    item.contextValue = 'message_item';
    item.eventDescription = null;
    item.name = name;
    item.location = location;
    return item;
  }

  private buildFileChangedItem(filesChangeSummary: FileChangeSummary[]): TimerItem {
    const parentItem = this.buildMessageItem(
      i18n.format('extension.timeMaster.tree.item.filesChanged.label'),
      i18n.format('extension.timeMaster.tree.item.filesChanged.detail'),
      null,
      null,
      null,
      null,
      'ct_top_files_by_kpm_toggle_node',
    );
    const childItem = this.buildMessageItem(i18n.format('extension.timeMaster.tree.item.today', { value: filesChangeSummary.length }));
    parentItem.children = [childItem];
    return parentItem;
  }

  private buildHighestKpmFileItem(filesChangeSummary: FileChangeSummary[]): TimerItem {
    if (!filesChangeSummary || filesChangeSummary.length === 0) {
      return null;
    }
    const sortedArray = filesChangeSummary.sort(
      (a: FileChangeSummary, b: FileChangeSummary) => b.kpm - a.kpm,
    );
    const highKpmChildren: TimerItem[] = [];
    const len = Math.min(3, sortedArray.length);
    for (let i = 0; i < len; i++) {
      const fileName = sortedArray[i].name;
      const kpm = sortedArray[i].kpm || 0;
      const kpmStr = kpm.toFixed(2);
      const label = `${fileName} | ${kpmStr}`;
      const messageItem = this.buildMessageItem(label, '', null, 'iceworks-time-master.openFileInEditor', [
        sortedArray[i].fsPath,
      ]);
      highKpmChildren.push(messageItem);
    }
    const highKpmParent = this.buildParentItem(
      i18n.format('extension.timeMaster.tree.item.topFilesByKPM.label'),
      i18n.format('extension.timeMaster.tree.item.topFilesByKPM.detail'),
      highKpmChildren,
      'ct_top_files_by_kpm_toggle_node',
    );
    return highKpmParent;
  }

  private buildMostEditedFileItem(filesChangeSummary: FileChangeSummary[]): TimerItem {
    if (!filesChangeSummary || filesChangeSummary.length === 0) {
      return null;
    }
    const sortedArray = filesChangeSummary.sort(
      (a: FileChangeSummary, b: FileChangeSummary) => b.keystrokes - a.keystrokes,
    );
    const mostEditedChildren: TimerItem[] = [];
    const len = Math.min(3, sortedArray.length);
    for (let i = 0; i < len; i++) {
      const fileName = sortedArray[i].name;
      const keystrokes = sortedArray[i].keystrokes || 0;
      const keystrokesStr = numeral(keystrokes).format(NUMBER_FORMAT);
      const label = `${fileName} | ${keystrokesStr}`;
      const messageItem = this.buildMessageItem(label, '', null, 'iceworks-time-master.openFileInEditor', [
        sortedArray[i].fsPath,
      ]);
      mostEditedChildren.push(messageItem);
    }
    const mostEditedParent = this.buildParentItem(
      i18n.format('extension.timeMaster.tree.item.topFilesByKey.label'),
      i18n.format('extension.timeMaster.tree.item.topFilesByKey.detail'),
      mostEditedChildren,
      'ct_top_files_by_keystrokes_toggle_node',
    );
    return mostEditedParent;
  }

  private buildLongestFileCodeTimeItem(filesChangeSummary: FileChangeSummary[]): TimerItem {
    if (!filesChangeSummary || filesChangeSummary.length === 0) {
      return null;
    }
    const sortedArray = filesChangeSummary.sort(
      (a: FileChangeSummary, b: FileChangeSummary) => b.sessionSeconds - a.sessionSeconds,
    );
    const longestCodeTimeChildren: TimerItem[] = [];
    const len = Math.min(3, sortedArray.length);
    for (let i = 0; i < len; i++) {
      const fileName = sortedArray[i].name;
      const durationMinutes = seconds2minutes(sortedArray[i].sessionSeconds);
      const codeHours = humanizeMinutes(durationMinutes);
      const label = `${fileName} | ${codeHours}`;
      const messageItem = this.buildMessageItem(label, '', null, 'iceworks-time-master.openFileInEditor', [
        sortedArray[i].fsPath,
      ]);
      longestCodeTimeChildren.push(messageItem);
    }
    const longestCodeTimeParent = this.buildParentItem(
      i18n.format('extension.timeMaster.tree.item.topFilesByCT.label'),
      i18n.format('extension.timeMaster.tree.item.topFilesByCT.detail'),
      longestCodeTimeChildren,
      'ct_top_files_by_codetime_toggle_node',
    );
    return longestCodeTimeParent;
  }

  private buildUserSummaryItem(
    label: string,
    tooltip: string,
    values: Array<{label?: string;tooltip?: string;icon?: string}>,
    collapsibleState: TreeItemCollapsibleState = null,
    name = '',
    location = 'ct_metrics_tree',
  ) {
    const parent: TimerItem = this.buildMessageItem(label, tooltip, null, null, null, name, location);
    values.forEach(({ label: vLabel, tooltip: vTooltip, icon: vIcon }) => {
      const child = this.buildMessageItem(vLabel, vTooltip, vIcon);
      parent.children.push(child);
    });
    if (collapsibleState) {
      parent.initialCollapsibleState = collapsibleState;
    }
    return parent;
  }

  private getUserSummaryItems(userSummary: UserSummary, globalSummary: GlobalSummary, averageSummary: AverageSummary): TimerItem[] {
    const {
      // editorSeconds,
      sessionSeconds,
      linesAdded,
      linesRemoved,
      keystrokes,
    } = userSummary;
    const {
      dailySessionSeconds: globalDailySessionSeconds,
      dailyKeystrokes: globalDailyLinesAdded,
      dailyLinesAdded: globalDailyLinesRemoved,
      dailyLinesRemoved: globalDailyKeystrokes,
    } = globalSummary;
    const {
      dailySessionSeconds: averageDailySessionSeconds,
      dailyKeystrokes: averageDailyLinesAdded,
      dailyLinesAdded: averageDailyLinesRemoved,
      dailyLinesRemoved: averageDailyKeystrokes,
    } = averageSummary;
    const items: TimerItem[] = [];
    const dayStr = moment().format('ddd');

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
        'ct_active_codetime_toggle_node',
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
      'ct_lines_added_toggle_node',
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
      'ct_lines_removed_toggle_node',
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
      'ct_keystrokes_toggle_node',
    ));

    return items;
  }

  private buildActionItem(
    label: string,
    tooltip: string,
    command: string,
    icon = '',
    eventDescription = '',
    color = '',
    location = 'ct_metrics_tree',
  ): TimerItem {
    const item = new TimerItem();
    item.tooltip = tooltip;
    item.label = label;
    item.id = label;
    item.command = command;
    item.icon = icon;
    item.contextValue = 'action_button';
    item.eventDescription = eventDescription;
    item.color = color;
    item.location = location;
    return item;
  }

  private buildDividerItem() {
    const item = this.buildActionItem('', '', '', 'blue-line-96.png');
    return item;
  }

  private buildViewProjectSummaryItem() {
    const item = this.buildActionItem(
      'View project summary',
      '',
      'iceworks-time-master.generateProjectSummaryDashboard',
      'folder.svg',
      '',
      'red',
    );
    item.name = 'ct_project_summary_btn';
    return item;
  }

  private buildViewUserSummaryItem() {
    const item = this.buildActionItem(
      'View summary',
      'View your latest coding metrics right here in your editor',
      'iceworks-time-master.generateUserSummaryDashboard',
      'dashboard.svg',
      'TreeViewLaunchDashboard',
      'purple',
    );
    item.name = 'ct_summary_btn';
    return item;
  }

  private async getTreeParents(): Promise<TimerItem[]> {
    const treeItems: TimerItem[] = [];
    const userSummary: UserSummary = await getUserSummary();
    const globalSummary: GlobalSummary = await getGlobalSummary();
    const averageSummary: AverageSummary = await getAverageSummary();
    const originFilesChangeSummary = await getFilesChangeSummary();

    const userSummaryItems: TimerItem[] = this.getUserSummaryItems(userSummary, globalSummary, averageSummary);

    // show the metrics per line
    treeItems.push(...userSummaryItems);

    // show the files changed metric
    const filesChanged = originFilesChangeSummary ? Object.keys(originFilesChangeSummary).length : 0;
    if (filesChanged > 0) {
      const filesChangeSummary = Object.keys(originFilesChangeSummary).map((key) => originFilesChangeSummary[key]);

      const fileChangedParent = this.buildFileChangedItem(filesChangeSummary);
      treeItems.push(fileChangedParent);

      const highKpmParent = this.buildHighestKpmFileItem(filesChangeSummary);
      if (highKpmParent) {
        treeItems.push(highKpmParent);
      }

      const mostEditedFileParent = this.buildMostEditedFileItem(filesChangeSummary);
      if (mostEditedFileParent) {
        treeItems.push(mostEditedFileParent);
      }

      const longestCodeTimeParent = this.buildLongestFileCodeTimeItem(filesChangeSummary);
      if (longestCodeTimeParent) {
        treeItems.push(longestCodeTimeParent);
      }
    }

    return treeItems;
  }

  getParent(): undefined {
    return undefined;
  }

  getTreeItem(p: TimerItem): TimerTreeItem {
    let treeItem: TimerTreeItem = null;
    if (p.children.length) {
      const collapsedState = timerCollapsedStateMap[p.label];
      if (!collapsedState) {
        treeItem = createTimerTreeItem(p, p.initialCollapsibleState);
      } else {
        treeItem = createTimerTreeItem(p, collapsedState);
      }
    } else {
      treeItem = createTimerTreeItem(p, TreeItemCollapsibleState.None);
    }
    return treeItem;
  }

  async getChildren(element?: TimerItem): Promise<TimerItem[]> {
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
}

function handleTimerChangeSelection(view: TreeView<TimerItem>, item: TimerItem) {
  if (item.command) {
    const args = item.commandArgs || [];
    if (args.length) {
      commands.executeCommand(item.command, ...args);
    } else {
      commands.executeCommand(item.command, item);
    }
  }

  // deselect it
  try {
    view.reveal(item, {
      focus: false,
      select: false,
    });
  } catch (err) {
    console.error(`Unable to deselect track: ${err.message}`);
  }
}

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
  treeView.onDidChangeSelection(async e => {
    if (!e.selection || e.selection.length === 0) {
      return;
    }
    const item: TimerItem = e.selection[0];
    handleTimerChangeSelection(treeView, item);
  });
  return treeView;
}
