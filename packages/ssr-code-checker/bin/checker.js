#!/usr/bin/env node

const argv = require('argv-parse');
const getFiles = require('./getFiles');
const options = require('./options.json');
const pkg = require('../package.json');
const { noUnitLessLineHeight, wrongGlobalVariableUsage } = require('../lib/index');

const args = argv(options);

// Show version
if (args.version) {
  console.log(pkg.version);
  process.exit();
}

// Show help text
if (args.help) {
  console.log('\nUsage : doctor [options]');
  Object.keys(options).forEach((key) => {
    const option = options[key];
    console.log(
      option.alias ? `  -${option.alias},` : '',
      `  --${key}`,
      option.type !== 'boolean' ? ` : ${option.type}` : '',
      option.required ? ' *required*' : ''
    );
    console.log(`      ${option.desc}`);
  });
  process.exit();
}

// Check project
if (args.scan) {
  let problems = [];
  getFiles(args.scan).forEach((file) => {
    if (/\.(js|jsx|ts|tsx)$/.test(file.path)) {
      // JSX check wrong-global-variable-usage
      problems = problems.concat(wrongGlobalVariableUsage(file.source, file.path));
    } else if (/\.(css|scss|sass|less)$/.test(file.path)) {
      problems = problems.concat(noUnitLessLineHeight(file.source, file.path));
    }
  });

  console.log(JSON.stringify(problems, null, '  '));
}
