import { I18n, TextMap } from "./type";

class I18nService implements I18n{
    localesTextMap: { [locale: string]: TextMap }= {};
    currentTextMap:TextMap = {};
    locale = 'zh-CN';
    constructor(){}
    registry(locale:string,text:TextMap){
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
            return "";
        }
        for(let attr in args){
            let reg = new RegExp(`\\\$\{\(\\\s)*${attr}\(\\\s)*\\}`,"g");
            i18nformatString = i18nformatString.replace(reg,args[attr]);
        }
        return i18nformatString;
    }
}
const i18n = new I18nService();
export default i18n;