export enum EntityType {
  LOCATION = 'location',
  ORGANIZATION = 'organization',
  PERSON = 'person'
}

export function fromValue(value: string) : EntityType {
  const found = Object
    .entries(EntityType)
    .find(([, t]) => t === value)
    ?.[1];
  if(!found) {
    throw Error(`Is not an entity type: ${value}`);
  }
  return found;
}
