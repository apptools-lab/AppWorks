const fse = require('fs-extra');

class RemoveBuildDepsPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('RemoveBuildDepsPlugin',
      () => {
        const packageJSON = fse.readJSONSync('./package.json');
        delete packageJSON.dependencies;
        delete packageJSON.devDependencies;
        fse.writeJSONSync('./package.json', packageJSON);
      });
  }
}

module.exports = RemoveBuildDepsPlugin;
