interface IScoreLevelInfo {
  name: string;
  color: string;
  range: {
    start: number;
    end: number;
  };
}

export const scoreLevelInfos: IScoreLevelInfo[] = [
  {
    name: 'bad',
    color: '#ff3000',
    range: {
      start: 0,
      end: 59,
    },
  },
  {
    name: 'good',
    color: '#ff9300',
    range: {
      start: 60,
      end: 79,
    },
  },
  {
    name: 'excellent',
    color: '#46bc15',
    range: {
      start: 80,
      end: 100,
    },
  },
];

export function getScoreLevelInfo(scroe: number): IScoreLevelInfo {
  return (
    scoreLevelInfos.find((config) => scroe >= config.range.start && scroe <= config.range.end) || scoreLevelInfos[0]
  );
}
