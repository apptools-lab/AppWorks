import * as path from 'path';
import * as fse from 'fs-extra';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import * as prettier from 'prettier';
import { layoutsPath, getProjectLanguageType } from '@appworks/project-service';
import { IMenuData } from './types';
import getASTByCode from '../utils/getASTByCode';

const HEADER_MENU_CONFIG_VARIABLES = 'headerMenuConfig';
const ASIDE_MENU_CONFIG_VARIABLES = 'asideMenuConfig';

/**
 * generate menu to menuConfig.js
 * @param data
 */
export async function create(data) {
  const { path: pagePath, pageName, layoutName, menuType } = data;
  const curPageMenuConfig = { path: pagePath, name: pageName };

  const menuConfigPath = await getConfigPath(layoutName);
  if (!menuConfigPath) {
    return;
  }

  const menuConfigAST = await getConfigAST(menuConfigPath);
  const {
    headerMenuConfig,
    asideMenuConfig,
  }: { headerMenuConfig?: IMenuData[]; asideMenuConfig?: IMenuData[] } = await getAllConfig(layoutName);

  if (menuType === 'headerMenuConfig' && headerMenuConfig instanceof Array) {
    headerMenuConfig.push(curPageMenuConfig);
  } else if (menuType === 'asideMenuConfig' && asideMenuConfig instanceof Array) {
    asideMenuConfig.push(curPageMenuConfig);
  }

  generateCode(headerMenuConfig, asideMenuConfig, menuConfigAST, menuConfigPath);
}

/**
 * get header menu configs and aside menu configs
 * @param menuConfigAST
 */
export async function getAllConfig(layoutName: string) {
  const menuConfigPath = await getConfigPath(layoutName);
  if (!menuConfigPath) {
    return;
  }
  const menuConfigAST = await getConfigAST(menuConfigPath);

  let headerMenuConfig;
  let asideMenuConfig;
  // @ts-ignore
  traverse(menuConfigAST, {
    VariableDeclarator: ({ node }) => {
      // find headerMenuConfig
      if (t.isIdentifier(node.id, { name: HEADER_MENU_CONFIG_VARIABLES }) && t.isArrayExpression(node.init)) {
        headerMenuConfig = parseConfig(node.init.elements);
      }
      // find asideMenuConfig
      if (t.isIdentifier(node.id, { name: ASIDE_MENU_CONFIG_VARIABLES }) && t.isArrayExpression(node.init)) {
        asideMenuConfig = parseConfig(node.init.elements);
      }
    },
  });
  return { headerMenuConfig, asideMenuConfig };
}

export async function getConfigPath(layoutName: string) {
  const projectLanguageType = await getProjectLanguageType();
  const menuConfigPath = path.join(layoutsPath, layoutName, `menuConfig.${projectLanguageType}`);

  if (fse.pathExistsSync(menuConfigPath)) {
    return menuConfigPath;
  } else {
    return false;
  }
}

async function getConfigAST(menuConfigPath: string) {
  const menuConfigString = await fse.readFile(menuConfigPath, 'utf-8');
  const menuConfigAST = getASTByCode(menuConfigString);
  return menuConfigAST;
}

function parseConfig(elements: any[]) {
  const config = [];
  elements.forEach((element) => {
    const { properties } = element;
    const item = {} as IMenuData;
    properties.forEach((property) => {
      const { key, value } = property;
      const { name: keyName } = key;
      if (keyName === 'children') {
        item.children = parseConfig(value.elements);
      } else {
        item[keyName] = value.value;
      }
    });
    config.push(item);
  });
  return config;
}

function generateCode(
  headerMenuConfig: IMenuData[],
  asideMenuConfig: IMenuData[],
  menuConfigAST: any,
  menuConfigPath: string,
) {
  const headerMenuConfigAST = getASTByCode(JSON.stringify(headerMenuConfig));
  const asideMenuConfigAST = getASTByCode(JSON.stringify(asideMenuConfig));
  traverse(menuConfigAST, {
    VariableDeclarator: ({ node }) => {
      // set headerMenuConfig
      if (t.isIdentifier(node.id, { name: HEADER_MENU_CONFIG_VARIABLES }) && t.isArrayExpression(node.init)) {
        node.init = headerMenuConfigAST.program.body[0] as any;
      }
      // set asideMenuConfig
      if (t.isIdentifier(node.id, { name: ASIDE_MENU_CONFIG_VARIABLES }) && t.isArrayExpression(node.init)) {
        node.init = asideMenuConfigAST.program.body[0] as any;
      }
    },
  });
  const result = formatCodeFromAST(menuConfigAST);
  fse.writeFileSync(menuConfigPath, result);
}

function formatCodeFromAST(ast: t.Node) {
  return prettier.format(
    // @ts-ignore
    generate(ast, {
      retainLines: true,
    }).code,
    {
      singleQuote: true,
      trailingComma: 'es5',
    },
  );
}
