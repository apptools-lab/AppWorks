import * as template from 'lodash.template';

export interface ITextMap {
  // "${namespace}.${extensionName}.${moudelName}.${fieldName}": "xxx"
  [key: string]: string;
}

export default class I18n {
  localesTextMap: { [locale: string]: ITextMap } = {};

  currentTextMap: ITextMap = {};

  registry(locale: string, text: ITextMap) {
    this.localesTextMap[locale] = text;
  }

  setLocal(locale: string) {
    this.currentTextMap = this.localesTextMap[locale] || this.localesTextMap[Object.keys(this.localesTextMap)[0]];
  }

  format(contentKey: string, args?: Record<string, unknown>) {
    const i18nformatString = this.currentTextMap[contentKey];
    if (!i18nformatString) {
      return '';
    }

    return args ? template(i18nformatString)(args) : i18nformatString;
  }
}
