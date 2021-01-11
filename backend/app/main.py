from fastapi import FastAPI, Request, Depends, status, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from .routers import articles, elements, images, notes, projects

from .database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()


origins = [ "http://127.0.0.1:8000", "*" ]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        )

app.include_router(articles.router)
app.include_router(elements.router)
app.include_router(images.router)
app.include_router(notes.router)
app.include_router(projects.router)

