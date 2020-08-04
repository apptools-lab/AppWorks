import { transformSync } from '@babel/core';
import { IFileEntity, IBabelOption } from './typing';
import decoratorPlugin from './babelDecoratorPlugin';
import babelDynamicImportPlugin from './babelDynamicImportPlugin';
import babelTransformTSPlugin from './babelTransformTSPlugin';

function ts2js(fileList: IFileEntity[], option: IBabelOption = {}): IFileEntity[] {
  const jsFiles: IFileEntity[] = fileList.map(
    (entity): IFileEntity => {
      const { code } = transformSync(entity.data, {
        plugins: [
          [
            decoratorPlugin,
            {
              decoratorsBeforeExport: !!option.decoratorsBeforeExport,
            },
          ],
          [babelDynamicImportPlugin],
          [
            babelTransformTSPlugin,
            {
              isTSX: true,
            },
          ],
        ],
      });

      return {
        ...entity,
        data: code,
      };
    }
  );

  return jsFiles;
}

export default ts2js;
