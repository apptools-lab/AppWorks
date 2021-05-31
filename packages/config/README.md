# `@appworks/config`

```js
import * as iceworksConfig from '@appworks/config';

iceworksConfig.get();
```

## Config

```typescript
interface IConfig {
  npmClient?: string;
  registry?: string;
  unpkgHost?: string;
  'fusion-token'?: string;
  'fusion-token-ali'?: string;
}
```

## API

### get

```js
const config = iceworksConfig.get();
const npmClient = iceworksConfig.get('npmClient');
```

### set

```js
const config = iceworksConfig.set('npmClient', 'cnpm');
```

### remove

```js
const config = iceworksConfig.remove('npmClient');
```

### addProject

TODO

### removeProject

TODO

### addMaterial

TODO

### removeMaterial

TODO