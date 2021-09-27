# Development setup

## Preparation

- Remove `.example` postfix of env files in `./`, `./dev/elucidate` and `./dev/textrepo`.

In parent dir:

- Get untanngle-elucidate conversion and import scripts:
```shell
git clone -b tt-878-republic-annotaties-omzetten https://github.com/knaw-huc/un-t-ann-gle.git untangle2elucidate
```

- Create textrepo `txt_anchor` tag using development docker-compose setup:
```
git clone -b txt_anchor https://github.com/knaw-huc/textrepo.git textrepo
cd textrepo && cp examples/development/* .
sed -i '' 's#knawhuc/textrepo-app:${DOCKER_TAG}#textrepo-elasticsearch:txt_anchor#' docker-compose-dev.yml
source docker-compose.env && docker-compose -f docker-compose-dev.yml build textrepo-app
```


## Run
Start containers of elucidate, textrepo and annotator:
```
docker-compose -f dev/elucidate/docker-compose.yml up -d
docker-compose -f dev/textrepo/docker-compose.yml up -d
docker-compose up -d
```

Open http://localhost:8000
