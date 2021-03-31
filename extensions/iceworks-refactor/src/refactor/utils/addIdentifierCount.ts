/**
 * record identifier
 */
function addOneIdentifierCount(name: string, map: Map<string, number>) {
  const identifierCount: number | undefined = map.get(name);

  if (!identifierCount) {
    map.set(name, 1);
  } else {
    map.set(name, identifierCount + 1);
  }
  return map.get(name) as number;
}

export default addOneIdentifierCount;
