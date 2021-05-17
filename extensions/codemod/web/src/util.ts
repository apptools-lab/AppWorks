export function updateTransformReportFile(transformFile, updatedFile) {
  const updated = updatedFile.status === 'ok';
  return { ...transformFile, updated };
}

/**
 * 根据更新文件结果更新扫描文件结果
 */
export function updateTransformReportFiles(transformFiles, updatedFiles) {
  return transformFiles.map((originFile) => {
    const updatedFile = updatedFiles.find(({ path }) => path === originFile.path);
    const fileInfo = updatedFile ? updateTransformReportFile(originFile, updatedFile) : originFile;
    return fileInfo;
  });
}
