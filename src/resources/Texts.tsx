import Config from "../Config";

export default class Texts {
    static readonly host = Config.TEXT_HOST;

    static async get(resourceId: string, begin: number, end: number) {
        const res = await fetch(`${this.host}/${resourceId}/segmentedtext/textgrid/${begin},${end}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        })
        return await res.json();
    }

}
