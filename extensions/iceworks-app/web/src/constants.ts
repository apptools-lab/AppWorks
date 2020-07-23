import { decode }from 'js-base64';

export const packageManagers = ['npm', 'cnpm', 'yarn'];

export const npmRegistries = [
  'https://registry.npmjs.org',
  'https://registry.npm.taobao.org'
]

export const AliNpmRegistry = decode('aHR0cHM6Ly9yZWdpc3RyeS5ucG0uYWxpYmFiYS1pbmMuY29t');

export const AliPackageManager = 'tnpm';

export const urlRegExp = new RegExp(
  '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  'i'
)