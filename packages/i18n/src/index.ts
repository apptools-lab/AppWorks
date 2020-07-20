import * as _ from 'lodash';
import { II18n, ITextMap } from './type';

export default class I18nService implements II18n{
  localesTextMap: { [locale: string]: ITextMap }= {};

  currentTextMap: ITextMap = {};

  locale = 'zh-cn';

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
<<<<<<< HEAD
}
=======
}
export default I18nService;
>>>>>>> 8baf025... feat: 改变了编译顺序，将 i18n package 导出的实体变为导出类。
