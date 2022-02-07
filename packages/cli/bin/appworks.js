#!/usr/bin/env node
const chalk = require('chalk');
const program = require('commander');
const semver = require('semver');
const fse = require('fs-extra');
const packageConfig = require('../package');
const checkVersion = require('../lib/utils/checkVersion').default;
const log = require('../lib/utils/log').default;
const { TEMP_PATH } = require('../lib/utils/constants');

program.version(packageConfig.version).usage('<command> [options]');

// output help information on unknown commands
program.arguments('<command>').action((cmd) => {
  program.outputHelp();
  console.log(chalk.red(`Unknown command ${chalk.yellow(cmd)}`));
  console.log();
});

program
  .command('init [type] [npmName]')
  .description('init material-collection/component by template')
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ appworks init');
    console.log('  $ appworks init component');
  })
  .action(async (type, npmName, cmd) => {
    // 兼容 iceworks init @icedesign/pro-scaffold
    if (type && ['material', 'component'].indexOf(type) === -1) {
      npmName = type;
      type = 'material';
    }

    const options = cleanArgs(cmd);
    options.npmName = npmName;
    options.type = type;

    try {
      // eslint-disable-next-line global-require
      await require('../lib/command/init').default(options);
    } catch (err) {
      await fse.remove(TEMP_PATH);
      log.error('appworks init error', err.message);
      console.error(err.stack);
      process.exit(1);
    }
  });

program
  .command('add [materialType] [npmName]')
  .description('add block to current directory')
  .option('-n, --name <name>', 'Specify the block directory name like CustomBlock')
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ appworks add');
    console.log('  $ appworks add block');
    console.log('  $ appworks add @icedesign/user-landing-block');
    console.log('  $ appworks add @icedesign/user-landing-block -n CustomBlock');
  })
  .action(async (materialType, npmName, cmd) => {
    // 兼容 iceworks add @icedesign/block-test
    if (materialType && ['scaffold', 'block', 'component', 'page'].indexOf(materialType) === -1) {
      npmName = materialType;
      materialType = null;
    }

    const options = cleanArgs(cmd);
    options.materialType = materialType;
    options.npmName = npmName;

    try {
      // eslint-disable-next-line global-require
      await require('../lib/command/add').default(options);
    } catch (err) {
      await fse.remove(TEMP_PATH);
      log.error('appworks add error', err.message);
      console.error(err.stack);
      process.exit(1);
    }
  });

program
  .command('generate')
  .description('generate material collection data(material.json)')
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ appworks generate');
  })
  .action(async () => {
    try {
      // eslint-disable-next-line global-require
      await require('../lib/command/generate').default();
    } catch (err) {
      log.error('appworks generate error', err.message);
      console.error(err.stack);
      process.exit(1);
    }
  });

program
  .command('sync')
  .description('sync materials data to Fusion Material Center')
  .option('-e, --env <env>', 'Specify fusion env, support daily|pre|prod')
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ appworks sync');
    console.log('  $ appworks sync --env daily');
  })
  .action(async (cmd) => {
    const options = cleanArgs(cmd);
    try {
      // eslint-disable-next-line global-require
      await require('../lib/command/sync').default(options);
    } catch (err) {
      log.error('appworks sync error', err.message);
      console.error(err.stack);
      process.exit(1);
    }
  });

program
  .command('config [type] [key] [value]')
  .description('operate appworks global config, support keys registry,unpkgHost,fusion-token,fusion-token-ali')
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log('Use the available 3.0.0 release');
    console.log('  $ appworks config list');
    console.log('  $ appworks config get registry');
    console.log('  $ appworks config set registry https://registry.npmjs.org');
    console.log('  $ appworks config set registry');
  })
  .action(async (type, key, value, cmd) => {
    const options = cleanArgs(cmd);
    options.type = type;
    options.key = key;
    options.value = value;
    try {
      // eslint-disable-next-line global-require
      await require('../lib/command/config').default(options);
    } catch (err) {
      log.error('appworks config error', err.message);
      console.error(err.stack);
      process.exit(1);
    }
  });

// add some useful info on help
program.on('--help', () => {
  console.log();
  console.log(`  Run ${chalk.cyan('appworks <command> --help')} for detailed usage of given command.`);
  console.log(`  Add LOG_LEVEL=verbose env will output debug log, like: ${chalk.cyan('LOG_LEVEL=verbose appworks sync')}`);
  console.log();
});

program.commands.forEach((c) => c.on('--help', () => console.log()));

program.parse(process.argv);

// log local version
logCLIVersion();

// check node version
checkNodeVersion();

// check @appworks/cli version
checkAppworksCLIVersion();

if (!process.argv.slice(2).length) {
  program.help();
}

function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
  const args = {};
  if (cmd) {
    cmd.options.forEach((o) => {
      const key = camelize(o.long.replace(/^--/, ''));
      // if an option is not present and Command has a method with the same name
      // it should not be copied
      if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
        args[key] = cmd[key];
      }
    });
    if (cmd.parent && cmd.parent.rawArgs) {
      args.command = cmd.parent.rawArgs[2];
    }
  }
  return args;
}

function checkNodeVersion() {
  if (!semver.satisfies(process.version, packageConfig.engines.node)) {
    console.log();
    console.log(chalk.red(`You must upgrade node to ${packageConfig.engines.node} to use iceworks`));
    console.log();
    process.exit(1);
  }
}

async function checkAppworksCLIVersion() {
  const packageName = '@appworks/cli';
  const packageVersion = packageConfig.version;
  const latestVersion = await checkVersion(packageName, packageVersion);
  if (latestVersion) {
    console.log(
      chalk.yellow(
        `A newer version of @appworks/cli is available(CHANGELOG: ${chalk.blue(
          'https://github.com/apptools-lab/AppWorks',
        )})`,
      ),
    );
    console.log(`  latest:     + ${chalk.yellow(latestVersion)}`);
    console.log(`  installed:  + ${chalk.red(packageVersion)} \n`);
    console.log(`  how to update: ${chalk.red('npm install @appworks/cli@latest -g')} \n`);
  }
}

function logCLIVersion() {
  console.log(chalk.grey('@appworks/cli:', packageConfig.version));
}
