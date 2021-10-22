import Config from "../Config";
import {Annotation, ENTITY, NS_PREFIX, toAnnotation} from "../model/Annotation";
import {ElucidateAnnotation} from "../model/ElucidateAnnotation";

export default class Elucidate {

  static readonly host = Config.ELUCIDATE_HOST;
  static readonly tr = Config.TEXTREPO_HOST;

  static readonly headers = {
    "Accept": "application/ld+json; profile=\"http://www.w3.org/ns/anno.jsonld\"",
    "Content-Type": "application/ld+json; profile=\"http://www.w3.org/ns/anno.jsonld\""
  };

  /**
   * Create a new entity annotation with:
   * - creator
   * - entity type
   * - comment
   */
  public static async create(versionId: string, a: Annotation): Promise<Annotation> {
    if (a.id) {
      throw Error('Cannot recreate an annotation that already has an ID: ' + a.id);
    }
    const body = {
      "@context": ["http://www.w3.org/ns/anno.jsonld", {
        "Entity": NS_PREFIX + ENTITY
      }],
      "type": ["Annotation", "Entity"],
      "creator": a.creator,
      "body": [
        {
          "type": "TextualBody",
          "purpose": "classifying",
          "value": a.entity_type
        },
        {
          "type": "TextualBody",
          "purpose": "commenting",
          "value": a.entity_comment
        }
      ],
      "target": `${this.tr}/view/versions/${versionId}/segments/index/${a.begin_anchor}/${a.begin_char_offset}/${a.end_anchor}/${a.end_char_offset}`
    };

    const res = await fetch(`${this.host}/annotation/w3c/${versionId}/`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body)
    });

    const responseBody = await res.json();
    return toAnnotation(responseBody as ElucidateAnnotation);
  }

  /**
   * Get items by creator
   */
  public static async getByCreator(creator: string) {
    let result: ElucidateAnnotation[] = [];
    let page = 0;
    let annotationPage;
    do {
      creator = encodeURIComponent(creator);
      const response = await fetch(
        `${this.host}/annotation/w3c/services/search/creator?levels=annotation&type=id&value=${creator}&page=${page}&desc=1`,
        {headers: this.headers}
      );
      annotationPage = await response.json();
      if (annotationPage.items) {
        result.push(...annotationPage.items);
      }
      page++;
    } while (annotationPage.next);
    return result;
  }

  /**
   * Get items by full body id
   */
  public static async getByBodyId(id: string): Promise<ElucidateAnnotation | undefined> {
    let queryParam = encodeURIComponent(id);
    const res = await fetch(
      `${this.host}/annotation/w3c/services/search/body?fields=id&value=${queryParam}`,
      {headers: this.headers}
    );
    const annotationPage = await res.json();
    const items = annotationPage?.first?.items;
    return items ? items[0] as ElucidateAnnotation : undefined;
  }

  /**
   * Get all items by partial ID
   */
  public static async getByBodyIdPrefix(idPrefix: string): Promise<ElucidateAnnotation[]> {
    idPrefix = encodeURIComponent(idPrefix);
    const response = await fetch(
      `${this.host}/annotation/w3c/services/search/body?fields=id&value=${idPrefix}&page=0&desc=1`,
      {headers: this.headers}
    );
    const annotationPage = await response.json();
    return annotationPage.items;
  }
}

