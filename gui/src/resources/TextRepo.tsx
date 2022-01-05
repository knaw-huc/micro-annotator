import Config from '../Config';

export default class TextRepo {
  static readonly host = Config.TEXTREPO_HOST;

  public static async getByVersionIdAndRange(id: string, start: number, end: number): Promise<string[]> {
    const res = await fetch(
      `${this.host}/view/versions/${id}/segments/index/${start}/${end}`,
    );
    return await res.json();
  }
}
