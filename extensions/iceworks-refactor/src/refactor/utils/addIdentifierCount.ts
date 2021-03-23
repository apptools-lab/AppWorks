function addOneIdentifierCount(identifierName: string, identifierMap: Map<string, number>) {
  const identifierCount: number | undefined = identifierMap.get(identifierName);

  if (!identifierCount) {
    identifierMap.set(identifierName, 1);
  } else {
    identifierMap.set(identifierName, identifierCount + 1);
  }
  return identifierMap.get(identifierName) as number;
}

export default addOneIdentifierCount;
