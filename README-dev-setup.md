# Development setup

## Preparation

In parent dir:
```shell
git clone https://github.com/knaw-huc/un-t-ann-gle.git
git clone -b tt-878-republic-annotaties-omzetten https://github.com/knaw-huc/un-t-ann-gle.git untangle2elucidate
````

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
