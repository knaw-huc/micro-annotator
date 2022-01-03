/**
 * Elucidate ID is an url with version ID followed by annotation ID
 */
export function toElucidateId(elucidateHost: string, versionId: string, annId: string) {
  return `${elucidateHost}/annotation/w3c/${versionId}/${annId}`;
}
