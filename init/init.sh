#!/usr/bin/env bash
set -x
set -e

EXTERNAL_ID=1728-textstore
TEXT_STORE_PATH=/usr/src/app/data/1728/10mrt-v1/1728-textstore.json

cd /usr/src/app/textrepo
pip install -r requirements.txt
VERSION_ID=$(python ./import-text-store.py)
echo "VERSION_ID: [${VERSION_ID}]"

cd /usr/src/app
pip install -r requirements.txt
pip install .
python ./scripts/convert_to_web_annotations.py data/1728-06-19-annotationstore.json
python ./scripts/export_to_elucidate.py -e http://elucidate:8080/annotation -c "$VERSION_ID"

