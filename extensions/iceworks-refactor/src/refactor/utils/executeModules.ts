function executeModules(modules, key, ret, ...options) {
  if (Array.isArray(modules)) {
    for (const module of modules) {
      module[key](ret, ...options);
      if (ret.done === true) break;
    }
  }

  return ret;
}

export default executeModules;
