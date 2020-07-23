import * as markdownLint from 'markdownlint';
import * as path from 'path';
import * as fse from 'fs-extra';

const EXTENSION_PATH = path.join(__dirname, '../extensions');
const ZHCN_DOC = 'README.md'
const I18N_DOC = 'README.en.md'
const DOCS = [];

// 加载所有docs
const extensions = fse.readdirSync(EXTENSION_PATH)
extensions.forEach(extension=>{
  if(extension.startsWith('.')){
    return;
  }
  DOCS.push(path.join(EXTENSION_PATH,extension,ZHCN_DOC));
  DOCS.push(path.join(EXTENSION_PATH,extension,I18N_DOC));
})

// MarkdownLint 设置
const OPTIONS = {
  files:DOCS,
  config:{
    'line-length':false,
    'first-line-heading':false,
  }
}

// 检测是否符合规范
const result = markdownLint.sync(OPTIONS);
if(result.toString()===''){
  console.log('Docs are checked successfully.')
}else{
  console.log('Docs are non-standard... Please correct mistakes: ')
  console.log(result.toString());
  process.exit(128);
}