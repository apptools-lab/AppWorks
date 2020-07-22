import * as _ from 'lodash';
import { II18n, ITextMap } from './type';

export default class I18nService implements II18n{
  localesTextMap: { [locale: string]: ITextMap } = {};

  currentTextMap: ITextMap = {};

  registry(locale: string,text: ITextMap){
    this.localesTextMap[locale] = text;
  }

  setLocal(locale: string){
    this.currentTextMap = this.localesTextMap[locale] || this.localesTextMap[Object.keys(this.localesTextMap)[0]];
  }
  
  format(contentKey: string, args?: object){
    const i18nformatString = this.currentTextMap[contentKey];
    if(!i18nformatString){
      return '';
    }
    
    return args ? _.template(i18nformatString)(args) : i18nformatString;
  }
}