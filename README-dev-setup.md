# Development setup

## Preparation

```shell
git clone https://github.com/knaw-huc/un-t-ann-gle.git
git clone https://github.com/knaw-huc/react-micro-annotator.git
git clone https://github.com/knaw-huc/textrepo.git
````

Change `datadir` path in `un-t-ann-gle/packages/annotation/aservice.py` and `un-t-ann-gle/packages/textservice/tservice.py` to existing path

## Run

Populate an `.env` with env vars as defined in `docker-compose.yml`. Example:
```
export REACT_APP_PLACEHOLDER_SEARCH_ID='meeting-1728-06-19-session-1-resolution-17'
```

Open http://localhost:8000


