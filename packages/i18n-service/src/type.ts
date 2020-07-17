export interface TextMap {
    // "${namespace}.${extensionName}.${moudelName}.${fieldName}": "xxx"
    [key: string]: string;
}
export interface I18n {
    // 存储语言和其对应的文本
    localesTextMap: { [locale: string]: TextMap };
  
    // 当前使用的语言
    locale: string;
  
    // 注册一门语言
    registry(locale: string, text: TextMap);
  
    // 设置当前使用的语言
    setLocal(locale: string);
  
    // 根据文本标识符获取对应的文本
    format(contentKey: string, args?: object);
  }