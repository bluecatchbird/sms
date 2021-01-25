# Readme

## Backend

### Preparation

```
$ cd backend
$ poetry install
$ poetry shell
$ uvicorn app.main:app --reload
```

### Running the server

```
$ uvicorn app.main:app --reload
```

The swagger page of the backend is now available under: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).


### Running  the tests

```
$ ./scripts/test.sh
```



## frontend
```
$ cd frontend
$ yarn
$ yarn run web
```

The frontend ist now available under [http://127.0.0.1:3000](http://127.0.0.1:3000).
