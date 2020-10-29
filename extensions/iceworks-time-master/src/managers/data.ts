import { KeystrokeStats } from '../keystrokeStats';

export async function processPayload(keystrokeStats: KeystrokeStats) {
  console.log('keystrokeStats', keystrokeStats);
  const sessionSeconds = keystrokeStats.getSessionSeconds();
  console.log(sessionSeconds);
}

export async function saveDataToDisk() {
  // fileChange

  // project

  // user
}

export async function sendDataToServer() {
  // TODO
}