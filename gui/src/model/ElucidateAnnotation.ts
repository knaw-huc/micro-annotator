export type AnnotatorBodyType = {
  "type": string,
  "value": string,
};

export type ElucidateBodyType = AnnotatorBodyType & {
  "id": string,
  "purpose": string
};

export type SelectorTarget = {
  "type": undefined,
  "selector": {
    "type": string,
    "end": number,
    "start": number
  },
  "source": string
};

export type ImageTarget = {
  "type": "Image",
  "selector": {
    "type": string,
    "conformsTo": string,
    "value": string
  } | undefined,
  "source": string
};

export type ElucidateTargetType = SelectorTarget | ImageTarget;

type TargetType = string | (ElucidateTargetType[]);

export type ElucidateAnnotation = {
  "id": string,
  "type": string,
  "created": string,
  "generator": {
    "id": string,
    "type": string,
    "name": string
  },
  "body": ElucidateBodyType | (ElucidateBodyType[]),
  "target": TargetType
  "motivation": string
};
