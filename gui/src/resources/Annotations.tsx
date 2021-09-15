import {Annotation} from "../model/Annotation";
import Config from "../Config";

export default class Annotations {
  static readonly host = Config.ANNOTATION_HOST;

  static async create(ann: Annotation) {
    const res = await fetch(`${this.host}/annotations`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(ann)
    })

    await res.json()
  }

  static async getBy(owner: string) {
    const res = await fetch(`${this.host}/volume-1728/annotations/56378,56499?owner=${owner}`)
    const data = await res.json()
    return data['annotations']
  }

  static async get(annotationId: string) {
    const res = await fetch(`${this.host}/annotations/${annotationId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    })
    return await res.json();
  }

}

