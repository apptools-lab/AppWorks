import { transformSync } from '@babel/core';
import { FileEntity, BabelOption } from './typing';
import decoratorPlugin from './babel-decorator-plugin';

function ts2js(fileList: FileEntity[], option: BabelOption = {}): FileEntity[] {
  console.log('ts2js');

  const jsFiles: FileEntity[] = fileList.map(
    (entity): FileEntity => {
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
