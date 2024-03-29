# Micro-annotator
Micro-annotator is a small, proof-of-concept webapp to create web annotations on segments of collection
documents, including both image segments and text segments. Image segments are provided by a IIIF server, text segments
by an instance of [TextRepo](https://github.com/knaw-huc/textrepo) and annotations by an adapted version of the 
[Elucidate](https://github.com/dlcs/elucidate-server) web annotation server.

## WIP: Development setup

### Option 1: Use existing images

#### Get untangle2elucidate and the data

In the Micro-annotator directory (`./`):

```
git clone -b tt-878-republic-annotaties-omzetten https://github.com/knaw-huc/un-t-ann-gle.git untangle2elucidate
```

#### Rename .env files and start the containers

- Remove `.example` postfix of env files in `./`, `./dev/elucidate` and `./dev/textrepo`.
- Run:
```
export COLLECTION_TAG=1728-06-19
docker compose -f dev/elucidate/docker-compose.yml up -d
docker compose -f dev/textrepo/docker-compose.yml up -d
docker compose up -d
docker compose -f docker-compose-init.yml up
```

Open http://localhost:8000


### Option 2: Build and import from scratch

#### Preparation

In parent dir: 
Get untanngle-elucidate data and import scripts:
```shell
git clone -b tt-878-republic-annotaties-omzetten https://github.com/knaw-huc/un-t-ann-gle.git untangle2elucidate
```

#### Optional: build new txt_anchor branch

In parent dir:
Create textrepo `txt_anchor` image using the development docker-compose setup:
```
git clone -b txt_anchor https://github.com/knaw-huc/textrepo.git textrepo
cd textrepo
cp examples/development/* .
sed -i '' 's#knawhuc/textrepo-app:${DOCKER_TAG}#textrepo-app:txt_anchor#' docker-compose-dev.yml
source docker-compose.env && docker compose -f docker-compose-dev.yml build textrepo-app
```

Change image of `textrepo-app` service in `./dev/textrepo/docker-compose.yml` to `textrepo-app:txt_anchor`

#### Re-configure micro-annotator
In micro-annotator:
- Remove `.example` postfix of env files in `./`, `./dev/elucidate` and `./dev/textrepo`.
- Change image `postgres` service in `./dev/textrepo/docker-compose.yml` to `postgres:11-alpine` 
- Change `image` section of `database` service in `./dev/elucidate/docker-compose.yml` into `build: .`
- Update env vars `TEXT_STORE_PATH` and `ANNO_STORE_PATH` in `docker-compose-init.yml` to desired un-t-ann-gle files 

#### Run

Start containers of elucidate, textrepo, annotator and init:
```
docker compose -f dev/elucidate/docker-compose.yml up -d
docker compose -f dev/textrepo/docker-compose.yml up -d
docker compose up -d
docker compose -f docker-compose-init.yml up
```

Open http://localhost:8000
