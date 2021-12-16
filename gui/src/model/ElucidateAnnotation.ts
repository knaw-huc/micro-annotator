type AnnotatorBodyType = {
  "type": string | (string[]),
  "value": string,
};

export type ElucidateBodyType = AnnotatorBodyType & {
  "id": string,
  "purpose": string
};

export type RecogitoCreator = { name: string; id: string };

export type BodyType = {
  purpose: string;
  "type": "TextualBody";
  "value": string
}

export type CommentingBodyType = BodyType & {
  "purpose": "commenting",
  "creator": RecogitoCreator
};

type ClassifyingBodyType = BodyType & {
  // Recogito calls it "tagging"
  "purpose": "classifying",
};

export type ClassifyingEntityBodyType = [ClassifyingBodyType, CommentingBodyType];

export type EntityBodyType = ClassifyingBodyType | ClassifyingEntityBodyType;

export type Selector = {
  "type": string,
  "end": number,
  "start": number
};

export type SelectorTarget = {
  "type": string,
  "selector": Selector,
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

export type TargetType = string | RecogitoTargetType | TextAnchorTargetType | ElucidateTargetType;


type RecogitoQuoteSelectorType = {
  type: "TextQuoteSelector";
  exact: string
}

type RecogitoPositionSelectorType = {
  type: "TextPositionSelector";
  start: number;
  end: number;
}

type RecogitoSelectorType = RecogitoQuoteSelectorType | RecogitoPositionSelectorType;

type TextAnchorTargetType = {
  "type": "urn:example:republic:TextAnchorSelector",
  "start": number,
  "end": number
}

export type RecogitoTargetType = {
  selector: RecogitoSelectorType[]
}

export type ElucidateAnnotation = {
  "@context": (string | {"Entity": string})[],
  "id": string,
  "type": string | string[],
  "created": string,
  "creator": string,
  "generator": {
    "id": string,
    "type": string,
    "name": string
  } | undefined,
  "body": BodyType | EntityBodyType | ElucidateBodyType | (ElucidateBodyType[]),
  "target": TargetType | TargetType[],
  "motivation": string,
  "ETag": string
};
