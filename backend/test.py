from fastapi import FastAPI, Request, Depends, status, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

import uuid
import json
from pydantic import BaseModel
from typing import List

import models, schemas
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from pathlib import Path
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


origins = [ "http://127.0.0.1:8000", "*" ]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        )



def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

async def getProject(project_id: uuid.UUID, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter_by(id=project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="project not found")
    return project

async def getArticle(project_id: uuid.UUID, article_id: uuid.UUID, db: Session = Depends(get_db)):
    article = db.query(models.Article).join(models.Project, models.Project.id == project_id) \
        .filter(models.Article.id==article_id).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="article not found")
    return article

async def getImage(project_id: uuid.UUID, article_id: uuid.UUID, image_id: uuid.UUID, db: Session = Depends(get_db)):
    image = db.query(models.Image) \
        .join(models.Article, models.Article.id == article_id) \
        .join(models.Project, models.Project.id == project_id) \
        .filter(models.Article.id==article_id) \
        .filter(models.Project.id==project_id) \
        .filter(models.Image.id==image_id).first()
    if not image:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="image not found")
    return image

async def getElement(project_id: uuid.UUID, article_id: uuid.UUID, element_id: uuid.UUID, db: Session = Depends(get_db)):
    element = db.query(models.Element) \
        .join(models.Project, models.Project.id == project_id) \
        .join(models.Article, models.Article.id == article_id) \
        .filter(models.Element.id==element_id).first()
    if not element:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="element not found")
    return element

async def getAllProjects(db: Session):
    projects = db.query(models.Project).all()
    return projects



@app.get("/project", response_model=List[schemas.ProjectWithId], tags=["project"])
async def getProjects(db: Session = Depends(get_db)):
    return await getAllProjects(db)

@app.post("/project", response_model=schemas.ProjectWithId, tags=["project"])
async def createNewProject(name: str, db: Session = Depends(get_db)):
    new_project = models.Project(name=name)
    db.add(new_project)
    db.commit()
    return new_project

@app.get("/project/{project_id}", response_model=schemas.ProjectDetailed, tags=["project"])
async def getProjectById(project: models.Project = Depends(getProject)):
    return project

@app.delete("/project/{project_id}", response_model=List[schemas.ProjectWithId], tags=["project"])
async def deleteProjectById(project: models.Project = Depends(getProject), db: Session = Depends(get_db)):
    db.delete(project)
    db.commit()
    return await getAllProjects(db)

@app.patch("/project/{project_id}", response_model=schemas.ProjectDetailed, tags=["project"])
async def setProjectName(new_name: str, project: models.Project = Depends(getProject), db: Session = Depends(get_db)):
    project.name = new_name
    db.commit()
    return project





@app.post("/project/{project_id}/article", response_model=schemas.ArticleDetailed, tags=["article"])
async def createNewArticle(name: str, project: models.Project = Depends(getProject), db: Session = Depends(get_db)):
    new_article = models.Article(name=name)
    db.add(new_article)
    project.articles.append(new_article)
    db.commit()
    return new_article

@app.get("/project/{project_id}/article/{article_id}", response_model=schemas.ArticleDetailed, tags=["article"])
async def getArticle(article: models.Article = Depends(getArticle)):
    return article

@app.patch("/project/{project_id}/article/{article_id}", response_model=schemas.ArticleDetailed, tags=["article"])
async def setArticleName(new_name: str, article: models.Article = Depends(getArticle), db: Session = Depends(get_db)):
    article.name = new_name
    db.commit()
    return article

@app.delete("/project/{project_id}/article/{article_id}", response_model=schemas.ProjectDetailed, tags=["article"])
async def deleteArticle(article: models.Article = Depends(getArticle), db: Session = Depends(get_db)):
    project = article.project
    db.delete(article)
    db.commit()
    return project




@app.post("/project/{project_id}/article/{article_id}/element", response_model=schemas.ElementWithId, tags=["element"])
async def addElement(element: schemas.Element, article: models.Article = Depends(getArticle), db: Session = Depends(get_db)):
    new_element = models.Element(name=element.name, value=element.value)
    db.add(new_element)
    article.elements.append(new_element)
    db.commit()
    return new_element

@app.patch("/project/{project_id}/article/{article_id}/element/{element_id}", response_model=schemas.ElementWithId, tags=["element"])
async def patchElement(new_element: schemas.Element, element: models.Element = Depends(getElement), db: Session = Depends(get_db)):
    element.name = new_element.name
    element.value = new_element.value
    db.commit()
    return element

@app.delete("/project/{project_id}/article/{article_id}/element/{element_id}", response_model=schemas.ArticleDetailed, tags=["element"])
async def deleteElement(element: models.Element = Depends(getElement), db: Session = Depends(get_db)):
    article = element.article
    db.delete(element)
    db.commit()
    return article


@app.patch("/project/{project_id}/article/{article_id}/notes", response_model=schemas.ArticleDetailed, tags=["notes"])
async def patchNotes(notes: schemas.Notes, article: models.Article = Depends(getArticle), db: Session = Depends(get_db)):
    article.notes = notes.text
    db.commit()
    return article


@app.post("/project/{project_id}/article/{article_id}/image", response_model=schemas.ArticleDetailed, tags=["image"])
async def addImage(image: UploadFile = File(...), article: models.Article = Depends(getArticle), db: Session = Depends(get_db)):
    extension = os.path.splitext(image.filename)[1]
    if extension.lower() not in [".png", ".jpg", ".jpeg"]:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="file type not supported: %s" % extension)

    new_image = models.Image()
    new_image.original_file_name=image.filename
    new_image.article=article
    db.add(new_image)
    db.flush()

    file_name = "".join([str(new_image.id), extension])
    new_image.storage_path="/".join(["upload_data", str(article.project_id), str(article.id), file_name])
    db.commit()

    Path(os.path.dirname(new_image.storage_path)).mkdir(parents=True, exist_ok=True)

    with open(new_image.storage_path, 'ab') as f:
        for chunk in iter(lambda: image.file.read(10000), b''):
            f.write(chunk)
    return article

@app.delete("/project/{project_id}/article/{article_id}/image/{image_id}", response_model=schemas.ArticleDetailed, tags=["image"])
async def deleteImage(image: models.Image = Depends(getImage), db: Session = Depends(get_db)):
    article = image.article
    db.delete(image)
    db.commit()
    return article

@app.get("/project/{project_id}/article/{article_id}/image/{image_id}", tags=["image"])
async def getImage(image: models.Image = Depends(getImage)):
    return FileResponse(image.storage_path)

