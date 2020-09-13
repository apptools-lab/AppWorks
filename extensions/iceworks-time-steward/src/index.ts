import { getUserInfo } from '@iceworks/common-service';
import { Timer } from './timer';

let timer: Timer;

export function activate() {
  console.info('start timer');
  const user = { account: '' };
  const init = (user) => {
    timer = new Timer(user);
    timer.initialize();
  };
  getUserInfo()
    .then((userInfo) => {
      console.info('userInfo: ', userInfo);
      init(userInfo);
    })
    .catch((e) => {
      console.error(e.message);
      init(user);
    });
}

export function deactivate() {
  timer.dispose();
  console.info('timer has been disabled!');
}
