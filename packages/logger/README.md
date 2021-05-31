# Logger for AppWorks

## Usage

```ts
import getLogger from '@appworks/logger';

const logger = getLogger('TimeMaster');
logger.info('xxx'); // log will save to disk: `~/.appworks/logs/TimeMaster.log`
```

See: https://www.npmjs.com/package/egg-logger
