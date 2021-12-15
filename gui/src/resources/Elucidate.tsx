import Config from "../Config";
import {MicroAnnotation} from "../model/Annotation";
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
  public static async create(versionId: string, a: MicroAnnotation): Promise<MicroAnnotation> {
    if (a.id) {
      throw Error('Cannot recreate an annotation that already has an ID: ' + a.id);
    }

    const res = await fetch(`${this.host}/annotation/w3c/${versionId}/`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(a)
    });

    return res.json();
  }

  /**
   * Get all by creator
   */
  public static async getByCreator(creator: string) {
    let url = `${this.host}/annotation/w3c/services/search/creator`;
    const params = new URLSearchParams({value: creator, levels: 'annotation', type: 'id'});
    return this.getAllPages(url, params)
  }

  /**
   * Get all by range
   */
  public static async getByRange(targetId: string, rangeStart: number, rangeEnd: number): Promise<ElucidateAnnotation[]> {
    let url = `${this.host}/annotation/w3c/services/search/range`;
    const params = new URLSearchParams({target_id: targetId, range_start: '' + rangeStart, range_end: '' + rangeEnd});
    return this.getAllPages(url, params)
  }

  /**
   * Search items by full body id
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
   * Search items by partial ID
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

  private static async getAllPages(url: string, params: URLSearchParams) {
    let result: ElucidateAnnotation[] = [];
    let annotationPage;
    let page = 0;
    do {
      params.set('page', '' + page)
      const response = await fetch(
        url + '?' + params.toString(),
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
}

