import { getDataFromSettingJson, saveDataToSettingJson } from '@iceworks/common-service';

const defaultDeviceConfig = {
  defaultDevice: 'Responsive',
  defaultResponsiveHeight: '640',
  defaultResponsiveWidth: '300',
  defaultDeviceData: [
    {
      label: 'iphone X',
      value: '375*812',
    },
    {
      label: 'Galaxy S5',
      value: '360*640',
    },
  ],
};

const debugServices = {
  async getDebugConfig() {
    const useMobileDebug = await getDataFromSettingJson('debugInMobileDevice', false);
    return { useMobileDebug };
  },
  async getDeviceConfig() {
    const userDeviceConfig = await getDataFromSettingJson('userDebugConfig', false);
    if (!userDeviceConfig) {
      await saveDataToSettingJson('userDebugConfig', defaultDeviceConfig);
      return defaultDeviceConfig;
    } else {
      return userDeviceConfig;
    }
  },
  async setDeviceConfig({ device }) {
    await saveDataToSettingJson('userDebugConfig.defaultDevice', device);
  },
  async setResponsiveConfig({ width, height }) {
    await saveDataToSettingJson('userDebugConfig.defaultResponsiveWidth', width);
    await saveDataToSettingJson('userDebugConfig.defaultResponsiveHeight', height);
  },
};

export default debugServices;
