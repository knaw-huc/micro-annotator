#!/usr/bin/env bash

TR=textrepo-app:8080
EXTERNAL_ID=1728-textstore
FILE_PATH=/usr/src/app/data/1728/10mrt-v1/1728-textstore.json

curl -s -XPOST $TR/rest/types/ -d '{"name": "anchor", "mimetype": "application/json+anchor"}' -H 'content-type: application/json' > /dev/null
VERSION_ID=$(curl -s "$TR/task/import/documents/$EXTERNAL_ID/anchor?allowNewDocument=true" -F "contents=@$FILE_PATH;filename=$EXTERNAL_ID.json" | jq -r '.versionId')
echo "new version id: $VERSION_ID"
