import * as vscode from 'vscode';

const collection = vscode.languages.createDiagnosticCollection('Iceworks');

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
      report.reports.forEach((report) => {
        const index = (cache.reports || []).findIndex((cacheReport) => cacheReport.filePath === report.filePath);
        if (index === -1) {
          cache.reports.push(report);
        } else {
          cache.reports[index] = report;
        }
      });
    }
    // Set diagnostics
    cache.reports.forEach((report) => {
      const diagnostics: vscode.Diagnostic[] = [];

      (report.messages || []).forEach((message: any) => {
        diagnostics.push({
          code: '',
          message: message.message,
          range: new vscode.Range(
            new vscode.Position(message.line - 1, message.column - 1),
            new vscode.Position(message.endLine - 1, message.endColumn - 1)
          ),
          severity: message.severity === 1 ? DiagnosticSeverity.Warning : DiagnosticSeverity.Error,
          source: 'Iceworks Doctor',
        });
      });

      collection.set(Uri.file(report.filePath), diagnostics);
    });
  } catch (e) {
    // ignore
  }
};
