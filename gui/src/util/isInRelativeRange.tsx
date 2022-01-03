export function isInRelativeRange(c: number[], endRange: number) {
  return c[0] >= 0 && c[2] <= endRange;
}
