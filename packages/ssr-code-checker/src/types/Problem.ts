interface IPosition {
  line: number;
  col: number;
}

export interface IProblem {
  uri: string;
  rule: string;
  range: {
    start: IPosition;
    end: IPosition;
  };
  source: string;
}
