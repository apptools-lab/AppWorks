function updateIdentifierMap(name, map, identifierNums) {
  if (!identifierNums) {
    identifierNums = 1;
    map.set(name, identifierNums);
  } else {
    identifierNums += 1;
    map.set(name, identifierNums + 1);
  }
  return map.get(name);
}

module.exports = updateIdentifierMap;
