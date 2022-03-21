# generate-project

根据[模板](https://github.com/ice-lab/react-materials/tree/master/scaffolds)生成项目初始化目录。

## 使用

```js
import { downloadAndGenerateProject } from '@iceworks/generate-project';

await downloadAndGenerateProject(
  projectDir,
  npmName,
  npmVersion,
  npmRegistry?,
  projectName?,
  ejsOptions?,
);
```
