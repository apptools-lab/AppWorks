function hasTypesRaxInObject(object: Object): boolean {
  const _TYPESRAX = '@types/rax';
  for (const key in object) {
    if (key === _TYPESRAX) {
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
