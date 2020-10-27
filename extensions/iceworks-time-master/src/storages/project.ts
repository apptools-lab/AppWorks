export interface ProjectResource {
  repository: string;
  branch: string;
  tag?: string;
}

export class Project {
  public id: string = '';
  public name: string = '';
  public directory: string = '';
  public resource: ProjectResource;
}

export class ProjectSummary extends Project {
  public editorSeconds: number = 0;
  public sessionSeconds: number = 0;
}