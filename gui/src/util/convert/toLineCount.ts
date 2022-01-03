export function toLineCount(lines: string[]) {
  const lineEnd = 1;
  let charCount = 0;
  return lines.map(l => charCount += l.length + lineEnd);
}
