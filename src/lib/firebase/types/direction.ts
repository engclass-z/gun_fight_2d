export const Direction = {
  left: 'left',
  right: 'right',
  front: 'front',
} as const;

export type Direction = typeof Direction[keyof typeof Direction];
