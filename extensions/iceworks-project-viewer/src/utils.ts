import * as path from "path";
import * as fs from 'fs';

export function makeTerminalPrettyName(cwd: string, taskName: string): string {
  return `${path.basename(cwd)} - ${taskName}`;
}

export function pathExists(p: string): boolean {
  try {
    fs.accessSync(p);
  } catch (err) {
    return false;
  }
  return true;
}
