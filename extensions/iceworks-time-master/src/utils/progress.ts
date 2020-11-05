import { Progress as VSCodeProgress } from 'vscode';

type OriginProgress = VSCodeProgress<{ message?: string; increment?: number }>;

export class Progress {
  public doneWriting: boolean;

  private progress: OriginProgress;

  constructor(progress: OriginProgress) {
    this.progress = progress;
  }

  private report(increment: number) {
    if (this.doneWriting) {
      return;
    }

    if (increment < 80) {
      increment += 10;
    } else if (increment < 90) {
      increment += 1;
    }

    increment = Math.min(90, increment);

    setTimeout(() => {
      this.progress.report({ increment });
      this.report(increment);
    }, 450);
  }

  start() {
    this.doneWriting = false;
    this.report(20);
  }

  done() {
    this.doneWriting = true;
    this.progress.report({ increment: 100 });
  }
}
