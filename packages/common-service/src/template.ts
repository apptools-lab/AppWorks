export function getImportTemplate(name: string, source: string): string {
  return `import ${name} from '${source}';\n`;
}

export function getTagTemplate(name: string): string {
  return `<${name} /> \n`;
}
