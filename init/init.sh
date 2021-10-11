#!/usr/bin/env bash
set -x
set -e

cd /usr/src/app/textrepo
pip install -r requirements.txt

# Expects TEXTREPO_HOST and TEXT_STORE_PATH:
VERSION_ID=$(python ./import-text-store.py)

echo "VERSION_ID: [${VERSION_ID}]"

cd /usr/src/app
pip install -r requirements.txt
pip install .
python ./scripts/convert_to_web_annotations.py data/1728-06-19-annotationstore.json
python ./scripts/export_to_elucidate.py -e http://elucidate:8080/annotation -c "$VERSION_ID"

