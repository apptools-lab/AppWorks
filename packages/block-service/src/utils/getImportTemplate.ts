export default function getImportTemplate(name: string, source: string): string {
  return `import ${name} from '${source}';\n`;
}
