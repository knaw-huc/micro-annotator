import {FormEvent, useEffect, useState} from "react";

type ElucidateCollectionProps = {
  collection: string | undefined,
  setCollection: (c: string) => void
}

export default function ElucidateCollection(props: ElucidateCollectionProps) {

  let collection = props.collection;
  const [collectionField, setCollectionField] = useState<string>('');

  useEffect(() => {
    setCollectionField(collection ? collection : '');
  }, [collection]);

  return <form className='add-form' onSubmit={handleSubmit}>
    <div className='form-control'>
      <label>Elucidate Collection</label>
      <input
        type='text'
        value={collectionField}
        onChange={e => setCollectionField(e.target.value)}
        disabled={true}
      />
    </div>
  </form>;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    props.setCollection(collectionField);
  }
}
