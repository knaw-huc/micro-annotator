import {useEffect, useState } from "react";
import Elucidate from "./resources/Elucidate";

export default function ElucidateCollection() {
  const [collection, setCollection] = useState<string>()

  useEffect(() => {
    const getUserAnnotations = async () => {
      const collection = await Elucidate.createCollection();
      console.log("Collection?", collection)
      setCollection(collection)
    }
    getUserAnnotations()
  }, []);

  return collection ? <p>Collection: {collection}</p> : <>Loading...</>;
}
