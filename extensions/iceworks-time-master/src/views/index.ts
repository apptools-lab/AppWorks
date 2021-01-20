
import { ExtensionContext, extensions, commands } from 'vscode';
import { checkIsO2 } from '@iceworks/common-service';
import { createTimerTreeView, TimerProvider } from './timerProvider';
import { createTimerStatusBar } from './timerStatusBar';
import logger from '../utils/logger';

function checkIsShowViews(): boolean {
  const isO2 = checkIsO2();
  const hasIceworksKit = extensions.getExtension('O2.icework-kit');
  return !(isO2 && hasIceworksKit);
}

export default async function (context: ExtensionContext) {
  const isShowViews = checkIsShowViews();
  let timerProvider: TimerProvider;
  let timerStatusBar;

  logger.debug('[TimeMaster][views]isShowViews', isShowViews);
  if (isShowViews) {
    commands.executeCommand('setContext', 'iceworks:enableTimeMasterView', true);

    timerProvider = new TimerProvider(context);
    const timerTreeView = createTimerTreeView(timerProvider);
    timerProvider.bindView(timerTreeView);

    timerStatusBar = await createTimerStatusBar();
    timerStatusBar.show();
  }

  return {
    timerProvider,
    timerStatusBar,
  };
}
