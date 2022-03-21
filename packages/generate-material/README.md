# generate-material

根据[物料模板](https://github.com/ice-lab/material-templates)生成物料（业务组件/区块/项目模板）初始化目录。

## 使用

```js
import { downloadMaterialTemplate, generateMaterial } from '@iceworks/generate-material';

const materialTemplateDir = __dirname;

await downloadMaterialTemplate(materialTemplateDir, '@icedesign/ice-react-material-template', registry);
await generateMaterial({
  rootDir: projectDir,
  materialTemplateDir,
  materialType: 'component',
  templateOptions: {
    npmName: '@ali/ice-label',
    adaptor: true,
  },
  enableDefPublish: true,
  enablePegasus: true,
});
```
