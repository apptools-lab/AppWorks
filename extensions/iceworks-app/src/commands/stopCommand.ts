import { ITerminalMap } from '../types';

export default function stopCommand(terminalMapping: ITerminalMap, scriptId: string) {
  const currentTerminal = terminalMapping.get(scriptId);
  if (currentTerminal) {
    currentTerminal.dispose();
    terminalMapping.delete(scriptId);
  }
}
