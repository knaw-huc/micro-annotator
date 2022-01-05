type AnnotatorBody = {
  'type': string | (string[]),
  'value': string,
};

export type ElucidateBody = AnnotatorBody & {
  'id': string,
  'purpose': string
};

export type RecogitoCreator = { name: string; id: string };

export type Body = {
  purpose: string;
  'type': 'TextualBody';
  'value': string
}

export type CommentingBody = Body & {
  'purpose': 'commenting',
  'creator': RecogitoCreator
};

type ClassifyingBody = Body & {
  // Recogito calls it 'tagging'
  'purpose': 'classifying',
};

export type ClassifyingEntityBody = [ClassifyingBody, CommentingBody];

export type EntityBody = ClassifyingBody | ClassifyingEntityBody;

export type Selector = {
  'type': string,
  'end': number,
  'start': number
};

export type SelectorTarget = {
  'type': string,
  'selector': Selector,
  'source': string
};

export type ImageTarget = {
  'type': 'Image',
  'selector': {
    'type': string,
    'conformsTo': string,
    'value': string
  } | undefined,
  'source': string
};

export type ElucidateTarget = SelectorTarget | ImageTarget;

export type Target = string | RecogitoTarget | TextAnchorTarget | ElucidateTarget;

type RecogitoQuoteSelector = {
  type: 'TextQuoteSelector';
  exact: string
}

export type RecogitoPositionSelector = {
  type: 'TextPositionSelector';
  start: number;
  end: number;
}

type RecogitoSelectorType = RecogitoQuoteSelector | RecogitoPositionSelector;

export type TextAnchorTarget = {
  'type': 'Text',
  'selector': {
    'type': 'urn:example:republic:TextAnchorSelector',
    'end': number,
    'start': number
  },
  'source': string
};


export type RecogitoTarget = {
  selector: RecogitoSelectorType[]
}

export type ElucidateAnnotation = {
  '@context': (string | { 'Entity': string })[],
  'id': string,
  'type': string | string[],
  'created': string,
  'creator': string,
  'generator': {
    'id': string,
    'type': string,
    'name': string
  } | undefined,
  'body': Body | EntityBody | ElucidateBody | (ElucidateBody[]),
  'target': Target | Target[],
  'motivation': string,
  'ETag': string
};
