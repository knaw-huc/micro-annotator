import React, { Component, useState } from "react";
import { Recogito } from "@recogito/recogito-js";
import "@recogito/recogito-js/dist/recogito.min.css";

interface DocumentProps {
  annotations: {}[];
  setAnnotations: (annotations: {}[]) => void;
}

let text = `Inventaris ende specificatie van
432
alle den huysraet Imboel porceleijne
Liwaet potgelt gout en silverwerck
by Catharina Cleyburgh naergelaten
voor soo veel desselfs gesamentlycke
Erfgenamen competeren in gevolgen
van d Testamente van deselve Catharina
Cleyburgh
en nooteboome kas
Twaelf ses karsseboome stoelen
ses spaense stoelen
-
Een spiegeltje
Een schildery van bedesda
Een dito van een hondt
Een dito van een appelkopertje
Een Landschap schildery
f
2
Een printebortje van d' langenins
Een printebortje synde een vogelaertje
Twee sackwerckse doofpotjens
Drie delfs werckse schootels
en schuymspaen
Een koopere visketel,
Een koopere Vijsel en stampert
Een metale podtsen koper decksel
Een groote tinne schotel
drie dito kleynder
ses Tinne taeffelborden
acht
Een Tinne Water pot
Een coopere Taartpan
Twee Een dito Blaeckers
-
noch eenigh kenckengoet
Twee groote porceleyne kommen
drie porceleyne drjlingen
„
seven
drie
Twee dubbelde porceleyne boterschotels
Twee dito boterschaeltjens
acht porceleyne boterschotels,
Twee groote papegays Coppen en vyfdito cleynder
Vier
Twee halve porceleyne lampet schootels
Een pleugkom
vier mostertschaeltjens
Twee kommetjens en twee Clapmutsjens
noch negen kopjens en tweebrandewyns
pimpeltjens
Tien doornickse Trype stoel cussens
Een groen Taeffelkleeden
Twee
ƒ
alle welcke voorsz. effecten en Contanten tsamen
ter somme van ses duijsent seven hondert acht
gls. negentien stver acht penningen door de voors.
Sr. Liscalhet sullen werden overgelevert ende
behaedight ten behoeve van de voorn. Erfgenamen
van Catharina Cleijburgh onderde aen de voorsz.
Sr David van der meer Somme door deselven
geadministrerde vruchten ende Interessen daervan ontf. ende aen
hem liscaljet uytgereijckt te werdn sijn
leven langh gedurende ingevolge van de Testa
mente van deselve Catharina Cleyburgh
bekennende oock mede hy Compt. Daniel liscaljet
van sijn duarie by huwelycxse voorwaerde
hem competerende ende van sijn gelogateerde
buyten de voorsz. vruchten ende Interessen voldaen ende
betaelt te sijn mitsgaders de gemelte Erfge
e
namen daervan oock bij desen te quiteren
met welcke voorsz. scheydinge ende delinge resp
de voorn. Compten verclaren seer wel te
vreede te syn ende te vergenoegen Belovende
de ee de anderen dh effecte van desen te
sullen doen ende laten genieten sonder daertegens
te doen ofte gedoogen gedaen te werden in
rechte noch daer buijten in geenderley
manieren, verbindende tot naercominge
deses haere persoonen ende goederen deselve
stellende ten bedwangh van allen rechten ende
rechteren Alles oprecht gedaen t Amst. ter
presentie van Jacob van der groe ende gere. Mnnick
als getuijgen hier toe versocht
Daniel E is kalijet
Harmen Dirckse Modeiller
huybert lieileers
wdijle blijbingh
GvGroe
DMannek
Quod attestor rogatus
d van der groe Nots. P.`;

// Make own component 'Document' for the annotatable source
export default class RecogitoExample extends Component<DocumentProps> {
  htmlId = "text-content";

  // Example tags that serve as suggestions in the tool
  VOCABULARY = [
    {
      label: "material",
      uri: "http://vocab.getty.edu/aat/300010358",
    },
    { label: "object", uri: "http://vocab.getty.edu/aat/300311889" },
    { label: "person", uri: "http://vocab.getty.edu/aat/300024979" },
  ];

  // Get the annotations from a static file in this case
  getAnnotations = async () => {
    const res = await fetch("annotations.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();

    return data;
  };

  // Initialize the Recogito instance after the component is mounted in the page
  componentDidMount() {
    const storeAnnotation = () => {
      this.props.setAnnotations(r.getAnnotations());
    };

    const r = new Recogito({
      content: this.htmlId,
      locale: "auto",
      mode: "pre",
      widgets: [
        { widget: "COMMENT" },
        {
          widget: "TAG",
          vocabulary: this.VOCABULARY,
        },
      ],
      relationVocabulary: ["isRelated", "isPartOf", "isSameAs "],
      formatter: (annotation: any) => {
        // Get all tags in the bodies of the annotation
        const tags = annotation.bodies.flatMap((body: any) =>
          body.purpose === "tagging" ? body.value : []
        );

        // See CSS for the actual styling
        const tagClasses: string[] = [];

        for (const tag of tags) {
          if (tag === "material") {
            tagClasses.push("tag-material");
          } else if (tag === "object") {
            tagClasses.push("tag-object");
          } else if (tag === "person") {
            tagClasses.push("tag-person");
          }
        }

        return tagClasses.join(" ");
      },
    });

    // Make sure that the annotations are stored in the state
    r.on("createAnnotation", storeAnnotation);
    r.on("deleteAnnotation", storeAnnotation);
    r.on("updateAnnotation", storeAnnotation);

    // Load the annotations from the file
    this.getAnnotations().then((annotations) => {
      annotations.map((annotation: {}) => r.addAnnotation(annotation));
      this.props.setAnnotations(annotations);
    });

    // For debugging, this can be helpful
    // console.log(r);
  }

  render() {
    return (
      <div id={this.htmlId}>
        <div className="code">{text}</div>
      </div>
    );
  }
}
