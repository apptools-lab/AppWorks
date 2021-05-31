const fs = require('fs');
const path = require('path');
const easyfile = require('easyfile');
const ejs = require('ejs');

function getTemplateFiles(projectType) {
  const files = [];
  const templateDir = path.join(__dirname, 'templates', projectType);

  function fileMapGenerator(projectDir) {
    easyfile.readdir(projectDir).forEach(filename => {
      const currPath = path.join(projectDir, filename);
      if (easyfile.isFile(currPath)) {
        files.push({
          content: fs.readFileSync(currPath, 'utf-8'),
          name: path.relative(templateDir, currPath),
        });
      } else {
        fileMapGenerator(currPath);
      }
    });
  }
  fileMapGenerator(templateDir);
  return files;
}

module.exports = function (targetDir, options) {
  const projectInfo = Object.assign({
    projectName: '',
    projectType: 'extension',
  }, options);

  const files = getTemplateFiles(options.projectType);

  files.forEach(file => {
    // Render ejs
    if (/\.ejs$/.test(file.name)) {
      try {
        file.content = ejs.render(file.content, projectInfo);
      } catch (error) {
        console.error(`\nError occurs when compiling "${file.name}" file.`);
        console.error(error);
      }
    }
    // Rename files start with '_' or end with '.ejs'.  Support Mac and Windows
    // Example: /web/_eslintignore -> /web/.eslintignore  \web\_eslintignore -> \web\.eslintignore
    file.name = file.name.replace(/^_/, '.').replace(/\/_/, '/.').replace('\\_', '\\.').replace(/\.ejs$/, '');
    // Write file
    easyfile.write(path.resolve(targetDir, file.name), file.content, { force: true });
  });

  console.log('appworks-generator done!');
};
