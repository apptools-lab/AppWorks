import * as path from 'path';
import { get, set, remove, IConfig, setConfigPath } from '..';

setConfigPath(path.join(__dirname, 'tmp/cli-config.json'));

test('set normal', async () => {
  const unpkgHost = 'https://unpkg.com/';
  const data: IConfig = set('unpkgHost', unpkgHost);

  expect(data.unpkgHost).toBe(unpkgHost);

  remove('unpkgHost');
  expect(get('unpkgHost')).toBe(undefined);
});

test('get list', async () => {
  const unpkgHost = 'https://unpkg.com/';
  set('unpkgHost', unpkgHost);

  const data = get();

  expect(data.unpkgHost).toBe(unpkgHost);

  remove('unpkgHost');
});
