# Readme

## backend
```
$ cd backend
$ pip3 install --user -r requirements.txt
$ export PATH="$PATH:$HOME/.local/bin"
$ uvicorn app.main:app --reload
```

The swagger page of the backend is now available under: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

## frontend
```
$ cd frontend
$ yarn
$ yarn run web
```

The frontend ist now available under [http://127.0.0.1:3000](http://127.0.0.1:3000).
