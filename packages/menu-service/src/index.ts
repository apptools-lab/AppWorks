import * as path from 'path';
import * as fse from 'fs-extra';
import traverse from '@babel/traverse';
import * as parser from '@babel/parser';
import * as t from '@babel/types';
import generate from '@babel/generator';
import * as prettier from 'prettier';
import { layoutsPath, getProjectLanguageType } from '@iceworks/project-service';
import { IMenuData } from './types';

const HEADER_MENU_CONFIG_VARIABLES = 'headerMenuConfig';
const ASIDE_MENU_CONFIG_VARIABLES = 'asideMenuConfig';

/**
 * generate menu to menuConfig.js
 * @param data
 */
export async function createMenu(data) {
  const { path: pagePath, pageName, layoutName, menuType } = data;
  const curPageMenuConfig = { path: pagePath, name: pageName };

  const menuConfigPath = await getMenuConfigPath(layoutName);
  if (!menuConfigPath) {
    return;
  }

  const menuConfigAST = await getMenuConfigAST(menuConfigPath);
  const {
    headerMenuConfig,
    asideMenuConfig,
  }: { headerMenuConfig?: IMenuData[]; asideMenuConfig?: IMenuData[] } = await getAllConfig(menuConfigPath);

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
export async function getAllConfig(menuConfigPath: string) {
  const menuConfigAST = await getMenuConfigAST(menuConfigPath);

  let headerMenuConfig;
  let asideMenuConfig;
  traverse(menuConfigAST, {
    VariableDeclarator: ({ node }) => {
      // find headerMenuConfig
      if (t.isIdentifier(node.id, { name: HEADER_MENU_CONFIG_VARIABLES }) && t.isArrayExpression(node.init)) {
        headerMenuConfig = parseMenuConfig(node.init.elements);
      }
      // find asideMenuConfig
      if (t.isIdentifier(node.id, { name: ASIDE_MENU_CONFIG_VARIABLES }) && t.isArrayExpression(node.init)) {
        asideMenuConfig = parseMenuConfig(node.init.elements);
      }
    },
  });
  return { headerMenuConfig, asideMenuConfig };
}

export async function getMenuConfigPath(layoutName: string) {
  const projectLanguageType = await getProjectLanguageType();
  const menuConfigPath = path.join(layoutsPath, layoutName, `menuConfig.${projectLanguageType}`);

  if (fse.pathExistsSync(menuConfigPath)) {
    return menuConfigPath;
  } else {
    return false;
  }
}

async function getMenuConfigAST(menuConfigPath: string) {
  const menuConfigString = await fse.readFile(menuConfigPath, 'utf-8');
  const menuConfigAST = getASTByCode(menuConfigString);
  return menuConfigAST;
}

function getASTByCode(code: string) {
  return parser.parse(code, {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    plugins: ['dynamicImport'],
  });
}

function parseMenuConfig(elements: any[]) {
  const config = [];
  elements.forEach((element) => {
    const { properties } = element;
    const item = {} as IMenuData;
    properties.forEach((property) => {
      const { key, value } = property;
      const { name: keyName } = key;
      if (keyName === 'children') {
        item.children = parseMenuConfig(value.elements);
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
    generate(ast, {
      retainLines: true,
    }).code,
    {
      singleQuote: true,
      trailingComma: 'es5',
    },
  );
}
