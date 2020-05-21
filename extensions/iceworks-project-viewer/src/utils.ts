import * as path from "path";

export function makeTerminalPrettyName(cwd: string, taskName: string): string {
  return `${path.basename(cwd)} - ${taskName}`;
}
