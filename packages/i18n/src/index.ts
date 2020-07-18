import * as _ from 'lodash';
import { II18n, ITextMap } from './type';

class I18nService implements II18n{
  localesTextMap: { [locale: string]: ITextMap }= {};

  currentTextMap: ITextMap = {};

  locale = 'zh-CN';

  registry(locale: string,text: ITextMap){
    this.localesTextMap[locale] = text;
  }

  // 设置当前使用的语言
  setLocal(locale: string){
    this.currentTextMap = this.localesTextMap[locale];
  }
  
  // 根据文本标识符获取对应的文本
  format(contentKey: string, args?: object){
    let i18nformatString = this.currentTextMap[contentKey];
    if(!i18nformatString){
      return '';
    }
    if(args){
      i18nformatString = _.template(i18nformatString)(args);
    }
    return i18nformatString;
  }
}
const i18n = new I18nService();
export default i18n;