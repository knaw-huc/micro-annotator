/**
 * Get text by version uuid (=first uuid in ann id)
 */
export default function toVersionId(id: string): string {
  const result = id.match(/.*\/w3c\/([0-9a-f-]{36})\/([0-9a-f-]{36})/)?.[1] as string;
  if (!result) {
    throw Error(`No version ID found in ${id}`);
  }
  return result;
}
