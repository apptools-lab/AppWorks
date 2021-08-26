import * as path from 'path';
import * as fse from 'fs-extra';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import * as prettier from 'prettier';
import * as upperCamelCase from 'uppercamelcase';
import { getProjectLanguageType, getProjectType, projectPath, appJSONFileName } from '@appworks/project-service';
import getASTByCode from '../utils/getASTByCode';

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
  const projectType = await getProjectType();
  if (projectType === 'react') {
    await bulkCreateReactProjectRouters(projectPath, [{ path: setPath, component: upperCamelCase(pageName) }], { parent });
  } else if (projectType === 'rax') {
    const route = {
      path: setPath,
      source: `pages/${pageName}/index`,
    };

    await bulkCreateRaxProjectRoutes(projectPath, route);
  }
}

export async function getAll() {
  const routerConfigAST = await getRouterConfigAST(projectPath);
  let config = [];
  // @ts-ignore
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
  const projectType = await getProjectType();
  const srcBasePath = path.join(projectPath, 'src');
  let routeConfigPath = '';

  if (projectType === 'react') {
    const projectLanguageType = await getProjectLanguageType();
    routeConfigPath = path.join(srcBasePath, `${routerConfigFileName}.${projectLanguageType}`);
  } else if (projectType === 'rax') {
    routeConfigPath = path.join(srcBasePath, appJSONFileName);
  }

  const pathExists: boolean = await fse.pathExists(routeConfigPath);
  return pathExists;
}

export async function bulkCreateRaxProjectRoutes(targetProjectPath, data) {
  const appConfigPath = path.join(targetProjectPath, 'src', appJSONFileName);
  const appConfig = fse.readJSONSync(appConfigPath);

  const { routes } = appConfig;
  if (routes && Array.isArray(routes)) {
    routes.push(data);
  } else {
    appConfig.routes = [data];
  }

  fse.writeJSONSync(appConfigPath, appConfig, { spaces: 2 });
}

export async function bulkCreateReactProjectRouters(targetProjectPath: string, routers: IRouter[], options: IRouterOptions = {}) {
  const { replacement = false, parent } = options;
  const routerConfigAST = await getRouterConfigAST(targetProjectPath);
  const projectLanguageType = await getProjectLanguageType();
  const routeConfigPath = path.join(targetProjectPath, 'src', `${routerConfigFileName}.${projectLanguageType}`);
  let allRouters = await getAll();

  if (!replacement) {
    if (parent) {
      const parentRouter = allRouters.find((item) => {
        if (item.children && item.path === parent) {
          return true;
        }
        return false;
      });
      if (parentRouter) {
        parentRouter.children = parentRouter.children.concat(routers);
      }
    } else {
      allRouters = allRouters.concat(routers);
    }
  }

  setData(allRouters, routers, routerConfigAST, routeConfigPath);
}

async function getRouterConfigAST(targetProjectPath) {
  const projectLanguageType = await getProjectLanguageType();
  const routeConfigPath = path.join(targetProjectPath, 'src', `${routerConfigFileName}.${projectLanguageType}`);
  const routerConfigString = await fse.readFile(routeConfigPath, 'utf-8');
  const routerConfigAST = getASTByCode(routerConfigString);
  return routerConfigAST;
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

function setData(allRouters: IRouter[], routers: IRouter[], routerConfigAST: any, routeConfigPath: string) {
  const dataAST = getASTByCode(JSON.stringify(sortData(allRouters)));
  const arrayAST = dataAST.program.body[0];

  // router import page or layout have @
  let existLazy = false;
  // React.lazy(): the existLazyPrefix is true
  // lazy(): the existLazyPrefix is false
  let existLazyPrefix = false;

  // find if there is lazy import
  traverse(routerConfigAST, {
    // parse eg. `const Forbidden = React.lazy(() => import('./pages/Exception/Forbidden'));`
    VariableDeclaration: ({ node }) => {
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
      }
    },
  });

  let importCode = '';
  let lazyCode = '';
  const sign = '@';
  // import new routers
  routers.forEach(({ component }) => {
    if (existLazy) {
      lazyCode += `const ${component} = ${existLazyPrefix ? 'React.' : ''}lazy(() => import('${sign}/pages/${component}'));\n`;
    }
    importCode += `import ${component} from '${sign}/pages/${component}';\n`;
  });

  const importCodeAST = getASTByCode(importCode);
  const lazyCodeAST = getASTByCode(lazyCode);

  const lastIndex = findLastImportIndex(routerConfigAST, existLazy);
  routerConfigAST.program.body.splice(lastIndex, 0, ...lazyCodeAST.program.body);
  routerConfigAST.program.body.splice(existLazy ? lastIndex - 1 : lastIndex, 0, ...importCodeAST.program.body);

  /**
   * { path: '/a', component: 'Page' }
   *          transform to
   * { path: '/a', component: Page }
   */
  // @ts-ignore
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
