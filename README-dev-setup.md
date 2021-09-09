# Development setup

## Preparation

```shell
git clone https://github.com/knaw-huc/un-t-ann-gle.git
git clone https://github.com/knaw-huc/react-micro-annotator.git
git clone https://github.com/knaw-huc/textrepo.git

pip3 install flask 
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
cd react-micro-annotator && npm install && npm start
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

