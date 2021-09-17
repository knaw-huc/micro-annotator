#!/usr/bin/env bash
set -x
#TR=textrepo-app:8080
#EXTERNAL_ID=1728-textstore
#FILE_PATH=/usr/src/app/data/1728/10mrt-v1/1728-textstore.json
#
#curl -s -XPOST $TR/rest/types/ -d '{"name": "anchor", "mimetype": "application/json+anchor"}' -H 'content-type: application/json' > /dev/null
#VERSION_ID=$(curl -s "$TR/task/import/documents/$EXTERNAL_ID/anchor?allowNewDocument=true" -F "contents=@$FILE_PATH;filename=$EXTERNAL_ID.json" | jq -r '.versionId')
#echo "new version id: $VERSION_ID"
sleep 2
echo 'test1'
ls -al
echo 'test1stop'
pip install -r requirements.txt
pip install .
python ./scripts/convert_to_web_annotations.py data/1728-06-19-annotationstore.json
python ./scripts/export_to_elucidate.py
