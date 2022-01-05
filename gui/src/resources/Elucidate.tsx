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
  public static async create(versionId: string, a: MicroAnnotation): Promise<ElucidateAnnotation> {
    if (a.id) {
      throw Error('Cannot recreate an annotation that already has an ID: ' + a.id);
    }
    const response = await fetch(`${this.host}/annotation/w3c/${versionId}/`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(a)
    });
    return await this.withEtag(response);
  }

  static async update(a: MicroAnnotation): Promise<ElucidateAnnotation> {
    if (!a.id) {
      throw Error('Cannot update annotation without ID: ' + JSON.stringify(a));
    }
    let headers = await this.withETagHeader(a, this.headers);
    const response = await fetch(a.id, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(a)
    });

    return await this.withEtag(response);
  }

  private static async withETagHeader(a: MicroAnnotation, headers: {}) {
    const eTag = a.ETag ? a.ETag : await this.requestEtag(a.id);
    let ifMatch = eTag.match(/W\/"([a-z0-9]*)"/)?.[1];
    if (!ifMatch) {
      throw new Error('Could not create If-Match header from ' + eTag);
    }
    return Object.assign({"If-Match": ifMatch}, headers);
  }

  private static async withEtag(response: Response) {
    const result = await response.json() as ElucidateAnnotation;
    let eTag = response.headers.get('ETag');
    if (eTag) {
      result.ETag = eTag;
    } else {
      throw new Error('No etag found in: ' + JSON.stringify(response.headers));
    }
    return result;
  }

  /**
   * Get all by creator
   */
  public static async getByCreator(creator: string) {
    let url = `${this.host}/annotation/w3c/services/search/creator`;
    const params = new URLSearchParams({value: creator, levels: 'annotation', type: 'id'});
    return this.getAllPages(url, params);
  }

  /**
   * Get all by range
   */
  public static async getByRange(targetId: string, rangeStart: number, rangeEnd: number): Promise<ElucidateAnnotation[]> {
    let url = `${this.host}/annotation/w3c/services/search/range`;
    return this.getWithRangePrams(targetId, rangeStart, rangeEnd, url);
  }

  /**
   * Get all by overlap
   */
  public static async getByOverlap(targetId: string, rangeStart: number, rangeEnd: number): Promise<ElucidateAnnotation[]> {
    let url = `${this.host}/annotation/w3c/services/search/overlap`;
    return this.getWithRangePrams(targetId, rangeStart, rangeEnd, url);
  }

  private static getWithRangePrams(targetId: string, rangeStart: number, rangeEnd: number, url: string) {
    const params = new URLSearchParams({target_id: targetId, range_start: '' + rangeStart, range_end: '' + rangeEnd});
    return this.getAllPages(url, params);
  }

  public static async requestEtag(elucidateId: string) {
    const response = await fetch(
      elucidateId,
      {headers: this.headers}
    );
    let eTag = response.headers.get('ETag');
    if (!eTag) {
      throw new Error('No ETag header could be found in response of ' + elucidateId);
    }
    return eTag;
  }

  /**
   * Search items by full body id
   */
  public static async findByBodyId(id: string): Promise<ElucidateAnnotation> {
    let queryParam = encodeURIComponent(id);
    const res = await fetch(
      `${this.host}/annotation/w3c/services/search/body?fields=id&strict=true&value=${queryParam}`,
      {headers: this.headers}
    );
    const annotationPage = await res.json();
    const items = annotationPage?.first?.items;
    let result = items ? items[0] as ElucidateAnnotation : undefined;
    if (!result) {
      throw Error('No elucidate annotation found');
    }
    return result;
  }

  /**
   * Search items by partial ID
   */
  public static async getFirstPageByBodyIdPrefix(idPrefix: string): Promise<ElucidateAnnotation[]> {
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
      params.set('page', '' + page);
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

