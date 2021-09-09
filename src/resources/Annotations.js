const ANNOTATION_HOST = `http://localhost:5001`;

export default class Annotations {

    static async create(ann) {
        const res = await fetch(`${ANNOTATION_HOST}/annotations`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(ann)
        })

        await res.json()
    }

    static async getBy(owner) {
        const res = await fetch(`${ANNOTATION_HOST}/volume-1728/annotations/56378,56499?owner=${owner}`)
        const data = await res.json()
        return data['annotations']
    }

    static async get(annotationID) {
        const res = await fetch(`${ANNOTATION_HOST}/annotations/${annotationID}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        })
        return await res.json();
    }
}

