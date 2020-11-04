async function installPackDeps() {
  // TODO
}

async function packagePack() {
  // TODO
}

async function buildPack() {
  await installPackDeps();
  await packagePack();
}

buildPack().catch((e) => {
  console.error(e);
});
