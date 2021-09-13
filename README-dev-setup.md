# Development setup

## Preparation

```shell
git clone https://github.com/knaw-huc/un-t-ann-gle.git
git clone https://github.com/knaw-huc/react-micro-annotator.git
git clone https://github.com/knaw-huc/textrepo.git

pip3 install flask 

cd react-micro-annotator && npm install 
````

Change `datadir` path in `un-t-ann-gle/packages/annotation/aservice.py` and `un-t-ann-gle/packages/textservice/tservice.py` to existing path

## Run

Start services:
```shell
cd un-t-ann-gle/packages/annotation/ && python3 aservice.py
```

```shell
cd un-t-ann-gle/packages/textservice/ && python3 tservice.py
```

Start annotator UI: 
```shell
cd react-micro-annotator && npm start
```

Set env vars:
```
export REACT_APP_PLACEHOLDER_SEARCH_ID='meeting-1728-06-19-session-1-resolution-17'
export REACT_APP_OWNER='HENNIE'
export REACT_APP_ANNOTATION_HOST='http://localhost:5001'
export REACT_APP_TEXT_HOST='http://localhost:5000'
```

Open http://localhost:3000

Temporarily disable CORS in browser: 
- `Acces-Control-Allow-Methods`: `GET, PUT`
- `Access-Control-Allow-Headers`: Include
- `Access-Control-Allow-Origin`: `Origin`
- Add (*) as the origin for all redirected URLs

Example Annotation ID: 
```
meeting-1728-06-19-session-1-resolution-17
```

