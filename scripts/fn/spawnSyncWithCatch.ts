import { spawnSync } from 'child_process';

// https://stackoverflow.com/questions/40149351/handle-node-js-spawnsync-errors
export function spawnSyncWithCatch(command: string, args: string[], cwd: string): void {
  const spawn = spawnSync(command, args, {
    stdio: ['inherit', 'inherit', 'pipe'],
    cwd,
  });

  const errorText = spawn.stderr.toString().trim();

  if (errorText) {
    console.log(errorText);
    process.exit(1);
  }
}
