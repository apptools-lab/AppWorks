function executeModules(modules, ret, ...options) {
  if (Array.isArray(modules)) {
    for (const module of modules) {
      module(ret, ...options);
      if (ret.done === true) break;
    }
  }

  return ret;
}

export default executeModules;
