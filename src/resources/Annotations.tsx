import {Annotation} from "../model/Annotation";

const ANNOTATION_HOST = `http://localhost:5001`;

export default class Annotations {

    static async create(ann: Annotation) {
        const res = await fetch(`${ANNOTATION_HOST}/annotations`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(ann)
        })

        await res.json()
    }

    static async getBy(owner: string) {
        const res = await fetch(`${ANNOTATION_HOST}/volume-1728/annotations/56378,56499?owner=${owner}`)
        const data = await res.json()
        return data['annotations']
    }

    static async get(annotationId: string) {
        const res = await fetch(`${ANNOTATION_HOST}/annotations/${annotationId}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        })
        return await res.json();
    }
}

