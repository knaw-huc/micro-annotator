React micro-annotator is a small, proof-of-concept React app to create web annotations on segments of collection
documents, including both image segments and text segments. Image segments are provided by a IIIF server, text segments
by an instance of knaw-huc/textrepo and annotations by an adapted version of the elucidate web annotation server.

```json
{
  "resource_id": "volume-1728",
  "label": "entity",
  "begin_anchor": 56385,
  "end_anchor": 56393,
  "begin_char_offset": 4,
  "end_char_offset": 20,
  "id": "annot_some_uuid",
  "entity_type": "location",
  "entity_text": "test",
  "owner": "HENNIE"
}
```

```json
{
  "@context": "http://www.w3.org/ns/anno.jsonld",
  "type": "Annotation",
  "body": {
    "type": "TextualBody",
    "value": "${entity_text}"
  },
  "target": "${$tr/view/versions/$version_id/segments/index/$begin_anchor/$begin_char_offset/$end_anchor/$end_char_offset}"
}
```

How to use TextRepo with micro-annotator:
- checkout `txt_anchor` branch
- create type: `{"name": "anchor", "mimetype": "application/json+anchor"}`
- create untanngle file: https://raw.githubusercontent.com/knaw-huc/un-t-ann-gle/master/data/1728/10mrt-v1/1728-textstore.json  -
- use segment view urls: `curl "$tr/view/versions/$version_id/segments/index/$begin_anchor/$begin_char_offset/$end_anchor/$end_char_offset" | jq`

## // TODO:

- store annotations in elaborate
- retrieve annotations from elaborate
- retrieve texts and annotations from textrepo
- make annotation visible
- restyle coordinate form field
- what to do with owner 'HENNIE'?

