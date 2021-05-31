import * as vscode from 'vscode';

const collection = vscode.languages.createDiagnosticCollection('AppWorks');

// Only set security problem to VS Code diagnostics
let cache: any = { reports: [] };

export default (report, rewrite?: boolean) => {
  const { Uri, DiagnosticSeverity } = vscode;

  try {
    if (rewrite) {
      // Rewrite cache. For whole project scan report
      cache = report;
    } else {
      // Update cache. For single file scan report
      report.reports.forEach((item) => {
        const index = (cache.reports || []).findIndex((cacheReport) => cacheReport.filePath === item.filePath);
        if (index === -1) {
          cache.reports.push(item);
        } else {
          cache.reports[index] = item;
        }
      });
    }
    // Set diagnostics
    cache.reports.forEach((item) => {
      const diagnostics: vscode.Diagnostic[] = [];

      (item.messages || []).forEach((message: any) => {
        let range = new vscode.Range(
          new vscode.Position(message.line - 1, message.column - 1),
          new vscode.Position(message.line - 1, message.column - 1),
        );
        if (message.endLine && message.endColumn) {
          range = new vscode.Range(
            new vscode.Position(message.line - 1, message.column - 1),
            new vscode.Position(message.endLine - 1, message.endColumn - 1),
          );
        }
        diagnostics.push({
          code: '',
          message: message.message,
          range,
          severity: message.severity === 1 ? DiagnosticSeverity.Warning : DiagnosticSeverity.Error,
          source: 'AppWorks Doctor',
        });
      });

      collection.set(Uri.file(item.filePath), diagnostics);
    });
  } catch (e) {
    // ignore
  }
};
