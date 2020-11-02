import * as path from 'path';
import * as fse from 'fs-extra';
import traverse from '@babel/traverse';
import * as parser from '@babel/parser';
import * as t from '@babel/types';
import generate from '@babel/generator';
import * as prettier from 'prettier';
import * as upperCamelCase from 'uppercamelcase';
import { getProjectLanguageType, projectPath, PAGE_DIRECTORY, LAYOUT_DIRECTORY } from '@iceworks/project-service';

interface IRouter {
  /**
   * URL path
   */
  path: string;

  /**
   * component name
   */
  component?: string;

  /**
   * layout name
   */
  layout?: string;

  /**
   * children routes
   */
  children?: IRouter[];
}

interface IRouterOptions {
  type?: string;
  replacement?: boolean;
  parent?: string;
}

const routerConfigFileName = 'routes';
const ROUTER_CONFIG_VARIABLE = 'routerConfig';
const ROUTE_PROP_WHITELIST = ['component', 'path', 'exact', 'strict', 'sensitive', 'children', 'redirect'];
const noPathPrefix = false;

export async function create(data) {
  const { path: setPath, pageName, parent } = data;
  await bulkCreate(projectPath, [{ path: setPath, component: upperCamelCase(pageName) }], { parent });
}

export async function getAll() {
  const routerConfigAST = await getRouterConfigAST(projectPath);
  let config = [];

  traverse(routerConfigAST, {
    VariableDeclarator: ({ node }) => {
      if (t.isIdentifier(node.id, { name: ROUTER_CONFIG_VARIABLE }) && t.isArrayExpression(node.init)) {
        config = parseRoute(node.init.elements);
      }
    },
  });

  return config;
}

export async function checkConfigPathExists() {
  const projectLanguageType = await getProjectLanguageType();
  const routeConfigPath = path.join(projectPath, 'src', `${routerConfigFileName}.${projectLanguageType}`);
  const pathExists: boolean = await fse.pathExists(routeConfigPath);
  return pathExists;
}

export async function bulkCreate(targetProjectPath: string, data: IRouter[], options: IRouterOptions = {}) {
  const { replacement = false, parent } = options;
  const routerConfigAST = await getRouterConfigAST(targetProjectPath);
  const projectLanguageType = await getProjectLanguageType();
  const routeConfigPath = path.join(targetProjectPath, 'src', `${routerConfigFileName}.${projectLanguageType}`);
  const currentData = await getAll();

  if (!replacement) {
    if (parent) {
      const parentRouter = currentData.find((item) => {
        if (item.children && item.path === parent) {
          return true;
        }
        return false;
      });
      if (parentRouter) {
        parentRouter.children = parentRouter.children.concat(data);
        data = currentData;
      }
    } else {
      data = currentData.concat(data);
    }
  }

  setData(data, routerConfigAST, routeConfigPath);
}

async function getRouterConfigAST(targetProjectPath) {
  const projectLanguageType = await getProjectLanguageType();
  const routeConfigPath = path.join(targetProjectPath, 'src', `${routerConfigFileName}.${projectLanguageType}`);
  const routerConfigString = await fse.readFile(routeConfigPath, 'utf-8');
  const routerConfigAST = getASTByCode(routerConfigString);
  return routerConfigAST;
}

function getASTByCode(code) {
  return parser.parse(code, {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    plugins: ['dynamicImport'],
  });
}

function parseRoute(elements) {
  const config = [];
  elements.forEach((element) => {
    const { properties } = element;
    const item: any = {};
    properties.forEach((property) => {
      const { key, value } = property;
      const { name: keyName } = key;

      // component is react Component
      if (keyName === 'component') {
        item[keyName] = value.name;
      } else if (keyName === 'children') {
        // children is array
        item.children = parseRoute(value.elements);
      } else if (ROUTE_PROP_WHITELIST.indexOf(keyName) > -1) {
        item[keyName] = value.value;
      }
    });
    if (Object.keys(item).length > 0) {
      config.push(item);
    }
  });
  return config;
}

function setData(data, routerConfigAST, routeConfigPath) {
  const dataAST = getASTByCode(JSON.stringify(sortData(data)));
  const arrayAST = dataAST.program.body[0];

  changeImportDeclarations(routerConfigAST, data);
  /**
   * { path: '/a', component: 'Page' }
   *          transform to
   * { path: '/a', component: Page }
   */
  traverse(dataAST, {
    ObjectProperty({ node }) {
      // @ts-ignore
      if (['component'].indexOf(node.key.value) > -1) {
        // @ts-ignore
        node.value = t.identifier(node.value.value);
      }
    },
  });
  traverse(routerConfigAST, {
    VariableDeclarator({ node }) {
      if (t.isIdentifier(node.id, { name: ROUTER_CONFIG_VARIABLE }) && t.isArrayExpression(node.init)) {
        node.init = arrayAST as any;
      }
    },
  });
  fse.writeFileSync(routeConfigPath, formatCodeFromAST(routerConfigAST));
}

function sortData(data) {
  data.forEach((item) => {
    if (item.children) {
      item.children = sortData(item.children);
    }
  });

  return data.sort((beforeItem, item) => {
    if (!beforeItem.path) {
      return 1;
    }
    if (!item.path) {
      return -1;
    }
    if (beforeItem.path.indexOf(item.path) === 0) {
      return -1;
    }
    if (item.path.indexOf(beforeItem.path) === 0) {
      return 1;
    }
    return 0;
  });
}

/**
 * 1. constant if there is layout or component in the data and ImportDeclarations
 * 2. remove import if there is no layout or component in the data
 * 3. add import if there is no layout or component in the ImportDeclarations
 */
function changeImportDeclarations(routerConfigAST, data) {
  const importDeclarations = [];
  const removeIndex = [];
  // router import page or layout have @
  let existLazy = false;
  // React.lazy(): the existLazyPrefix is true
  // lazy(): the existLazyPrefix is false
  let existLazyPrefix = false;

  traverse(routerConfigAST, {
    ImportDeclaration: ({ node, key }) => {
      const { source } = node;
      // parse import declaration to get directory type (layouts or pages)
      // support three path types
      // 1. import xxx from 'pages/xxx';
      // 2. import xxx from './pages/xxx';
      // 3. import xxx from '@/pages/xxx';
      const noPrefixReg = /^(layouts|pages)\//;
      const hasPrefixReg = /^(\.|@)\/(layouts|pages)\//;
      const reg = noPathPrefix ? noPrefixReg : hasPrefixReg;
      const idx = noPathPrefix ? 1 : 2;
      const match = source.value.match(reg);

      if (match && match[idx]) {
        const { specifiers } = node;
        const { name } = specifiers[0].local;
        importDeclarations.push({
          index: key,
          name,
          type: match[idx],
        });
      }
    },

    // parse eg. `const Forbidden = React.lazy(() => import('./pages/Exception/Forbidden'));`
    VariableDeclaration: ({ node, key }) => {
      const { code } = generate(node.declarations[0]);
      // parse const declaration to get directory type (layouts or pages)
      // support three path types
      // 1. const xxx = (React.)?lazy(() => import('pages/xxx'));
      // 2. const xxx = (React.)?lazy(() => import('./pages/xxx'));
      // 3. const xxx = (React.)?lazy(() => import('@/pages/xxx'));
      const noPrefixReg = /(\w+)\s=\s(React\.)?lazy(.+)import\(['|"]((\w+)\/.+)['|"]\)/;
      const hasPrefixReg = /(\w+)\s=\s(React\.)?lazy(.+)import\(['|"]((\.|@)\/(\w+)\/.+)['|"]\)/;
      const matchLazyReg = noPathPrefix ? noPrefixReg : hasPrefixReg;
      const idx = noPathPrefix ? 5 : 6;
      const match = code.match(matchLazyReg);

      if (match && match.length > idx) {
        existLazy = true;
        if (match[2]) {
          existLazyPrefix = true;
        }
        importDeclarations.push({
          index: key,
          name: match[1],
          type: match[idx],
        });
      }
    },
  });

  /**
   * remove import if there is no layout or component in the data
   */
  importDeclarations.forEach((importItem) => {
    const { name, type, index } = importItem;
    let needRemove = false;

    // match layout or page
    if (type) {
      let findRouter = null;

      if (type === LAYOUT_DIRECTORY) {
        // layout only first layer
        findRouter = data.find((item) => item.children && item.component === name);
      } else if (type === PAGE_DIRECTORY) {
        findRouter = data.find((item) => {
          let pageItem = null;

          if (!item.children && item.component === name) {
            pageItem = item;
          }

          if (item.children) {
            item.children.forEach((route) => {
              if (route.component === name) {
                pageItem = route;
              }
            });
          }

          return pageItem;
        });
      }
      if (!findRouter) {
        needRemove = true;
      }
    }

    if (needRemove) {
      removeIndex.unshift(index);
    }
  });

  removeIndex.forEach((index) => {
    routerConfigAST.program.body.splice(index, 1);
  });

  // add new page or layout
  function setNewComponent(type, component) {
    const componentExist = existImport(importDeclarations, component, type);

    // no component dont add import
    if (!component) {
      return false;
    }

    if (!componentExist && !newImports.find((item) => item.name === component)) {
      newImports.push({
        type,
        name: component,
      });
    }
  }

  /**
   * add import if there is no layout or component in the ImportDeclarations
   */
  const newImports = [];
  data.forEach(({ component, children }) => {
    if (children) {
      setNewComponent(LAYOUT_DIRECTORY, component);
      children.forEach((route) => setNewComponent(PAGE_DIRECTORY, route.component));
    } else {
      setNewComponent(PAGE_DIRECTORY, component);
    }
  });

  /**
   * add import to ast
   *  eg.
   *     import Page1 from './pages/Page1';
   *            or
   *     const Profile = React.lazy(() => import('./pages/Profile'));
   */
  let lazyCode = '';
  let importCode = '';
  const sign = '@';
  newImports.forEach(({ name, type }) => {
    if (noPathPrefix) {
      importCode += `import ${name} from '${type}/${name}';\n`;
    } else if (!existLazy || type === LAYOUT_DIRECTORY) {
      // layour or not exist lazy use `import Page from '@/pages/Page'`
      importCode += `import ${name} from '${sign}/${type}/${name}';\n`;
    } else {
      // use lazy `const Page = React.lazy(() => import('@/pages/Page'))`
      lazyCode += `const ${name} = ${existLazyPrefix ? 'React.' : ''}lazy(() => import('${sign}/${type}/${name}'));\n`;
    }
  });

  // get ast from lazy or import code
  const lazyCodeAST = getASTByCode(lazyCode);
  const importCodeAST = getASTByCode(importCode);

  const lastIndex = findLastImportIndex(routerConfigAST, existLazy);
  routerConfigAST.program.body.splice(lastIndex, 0, ...lazyCodeAST.program.body);
  routerConfigAST.program.body.splice(existLazy ? lastIndex - 1 : lastIndex, 0, ...importCodeAST.program.body);
}

function existImport(list, name, type) {
  return list.some((item) => {
    if (name === item.name && type === item.type) {
      return true;
    }
    return false;
  });
}

/**
 * find last import index
 */
function findLastImportIndex(routerConfigAST, existLazy) {
  let lastIndex = 0;
  routerConfigAST.program.body.forEach((item, index) => {
    if (item.type === 'ImportDeclaration') {
      if (existLazy) {
        lastIndex = index + 2;
      } else {
        lastIndex = index + 1;
      }
    }
  });
  return lastIndex;
}

function formatCodeFromAST(ast: any): string {
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
