export const testCases: Array<{
  edges: Array<{a: number; b: number; weight: number}>;
  goals: Array<{end: number; start: number; expected: Array<number>}>;
  name: string;
}> = [
  {
    edges: [
      {a: 1, b: 4, weight: 10},
      {a: 1, b: 2, weight: 2},
      {a: 2, b: 3, weight: 2},
      {a: 3, b: 4, weight: 2},
      {a: 2, b: 4, weight: 6},
    ],
    goals: [{end: 4, expected: [1, 2, 3, 4], start: 1}],
    name: 'manual',
  },
];
