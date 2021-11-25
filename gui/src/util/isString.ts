export default function isString(value: any) {
  return typeof value === 'string' || value instanceof String;
}
