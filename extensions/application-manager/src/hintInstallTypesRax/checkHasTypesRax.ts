function hasTypesRaxInObject(object: Object): boolean {
  const TYPES_RAX = '@types/rax';
  for (const key in object) {
    if (key === TYPES_RAX) {
      return true;
    }
  }
  return false;
}

export default (projectPackageJSON: any): boolean => {
  const { devDependencies, dependencies } = projectPackageJSON;
  let flag = false;
  if (devDependencies && typeof devDependencies === 'object' && hasTypesRaxInObject(devDependencies)) {
    flag = true;
  }
  if (dependencies && typeof dependencies === 'object' && hasTypesRaxInObject(dependencies)) {
    flag = true;
  }
  return flag;
};
