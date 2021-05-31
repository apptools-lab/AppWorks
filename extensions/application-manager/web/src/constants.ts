import { ALI_NPM_REGISTRY } from '@appworks/constant';

export const packageManagers = ['npm', 'cnpm', 'yarn'];

export const npmRegistries = ['https://registry.npmjs.org', 'https://registry.npm.taobao.org'];

export const AliNpmRegistry = ALI_NPM_REGISTRY;

export const AliPackageManager = 'tnpm';

export const INPUT_WIDTH = 'inputWidth';

export const INPUT_HEIGHT = 'inputHeight';

export const DEVICE_WIDTH = 'deviceWidth';

export const DEVICE_HEIGHT = 'deviceHeight';

export const RESPONSIVE_DEFAULT_WIDTH = '300';

export const RESPONSIVE_DEFAULT_HEIGHT = '640';

export const RESPONSIVE_DEVICE = 'Responsive';

export const EDIT_DEVICE = 'Edit';

export const urlRegExp = new RegExp(
  '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  'i',
);
export const defaultDeviceData = [
  {
    label: 'iphone X',
    value: '375*812',
    customizeDevice: false,
  },
  {
    label: 'Galaxy S5',
    value: '360*640',
    customizeDevice: false,
  },
];

export const responsiveItem = {
  label: RESPONSIVE_DEVICE,
  value: RESPONSIVE_DEVICE,
};

export const editItem = {
  label: EDIT_DEVICE,
  value: EDIT_DEVICE,
};

export const FULL_SCREEN = '100%';

export const DEVICE_PREVIEW_MARGIN = 0.1;
