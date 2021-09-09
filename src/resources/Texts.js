const TEXT_HOST = `http://localhost:5000`;
export default class Texts {

    static async get(resourceId, begin, end) {
        const res = await fetch(`${TEXT_HOST}/${resourceId}/segmentedtext/textgrid/${begin},${end}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        })
        return await res.json();
    }

}
