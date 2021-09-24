# Development setup

## Preparation

In parent dir:

```shell
git clone https://github.com/knaw-huc/un-t-ann-gle.git
git clone -b tt-878-republic-annotaties-omzetten https://github.com/knaw-huc/un-t-ann-gle.git untangle2elucidate

# Create textrepo-txt_anchor image using development docker-compose setup:
git clone -b txt_anchor https://github.com/knaw-huc/textrepo.git textrepo
cd textrepo && cp examples/development/* .
sed -i .backup 's#knawhuc/textrepo-app:${DOCKER_TAG}#textrepo-elasticsearch:txt_anchor#' docker-compose-dev.yml && rm .backup
docker-compose build textrepo-app
```

Run in micro-annotator dir: 
```
source docker-compose.env && docker-compose -f docker-compose-dev.yml build textrepo-app
```

Change `datadir` path to existing path in: 
- `un-t-ann-gle/packages/annotation/aservice.py`
- `un-t-ann-gle/packages/textservice/tservice.py`
  
Change `elucidate_base_url` value to `http://elucidate:8080/annotation` in:
- `untangle2elucidate/scripts/export_to_elucidate.py`

Add `requests` module to `untangle2elucidate/requirements.txt`

Remove `.example` postfix of example env files in `./`, `./dev/elucidate` and `./dev/textrepo`.

## Run
Start containers of elucidate, textrepo and and micro-annotator:
```
docker-compose -f dev/elucidate/docker-compose.yml up -d && \
docker-compose -f dev/textrepo/docker-compose.yml up -d && \
docker-compose up -d
```

Open http://localhost:8000
