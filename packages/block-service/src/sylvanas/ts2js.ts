import { transformSync } from '@babel/core';
import { IFileEntity, IBabelOption } from './typing';
import decoratorPlugin from './babel-decorator-plugin';

function ts2js(fileList: IFileEntity[], option: IBabelOption = {}): IFileEntity[] {
  console.log('ts2js');

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
          [require.resolve('@babel/plugin-syntax-dynamic-import')],
          [
            require.resolve('@babel/plugin-transform-typescript'),
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
    },
  );

  return jsFiles;
}

export default ts2js;
