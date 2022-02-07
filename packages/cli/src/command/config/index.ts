import config from '../../utils/config';

interface IConfig {
  type?: string;
  key?: string;
  value?: any;
}

export default async function (options: IConfig): Promise<any> {
  const { type, key, value } = options;

  if (!type || type === 'list') {
    const data = await config.get();
    console.log(data);
    return data;
  } else if (type === 'set') {
    await config.set(key, value);
    console.log('update config success');
  } else if (type === 'get') {
    const data = await config.get(key);
    console.log(data);
    return data;
  } else {
    throw new Error('Invalid options');
  }
}
