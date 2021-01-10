from fastapi import FastAPI, Request, Depends, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import uuid
import json
from pydantic import BaseModel
from typing import List

import models, schemas
from database import SessionLocal, engine
from sqlalchemy.orm import Session

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



@app.get("/project", response_model=List[schemas.ProjectWithId])
async def getProjects(db: Session = Depends(get_db)):
    return await getAllProjects(db)

@app.post("/project", response_model=schemas.ProjectWithId)
async def createNewProject(name: str, db: Session = Depends(get_db)):
    new_project = models.Project(name=name)
    db.add(new_project)
    db.commit()
    return new_project

@app.get("/project/{project_id}", response_model=schemas.ProjectDetailed)
async def getProjectById(project: models.Project = Depends(getProject)):
    return project

@app.delete("/project/{project_id}", response_model=List[schemas.ProjectWithId])
async def deleteProjectById(project: models.Project = Depends(getProject), db: Session = Depends(get_db)):
    db.delete(project)
    db.commit()
    return await getAllProjects(db)

@app.patch("/project/{project_id}", response_model=schemas.ProjectDetailed)
async def setProjectName(new_name: str, project: models.Project = Depends(getProject), db: Session = Depends(get_db)):
    project.name = new_name
    db.commit()
    return project





@app.post("/project/{project_id}/article", response_model=schemas.ArticleDetailed)
async def createNewArticle(name: str, project: models.Project = Depends(getProject), db: Session = Depends(get_db)):
    new_article = models.Article(name=name)
    db.add(new_article)
    project.articles.append(new_article)
    db.commit()
    return new_article

@app.get("/project/{project_id}/article/{article_id}", response_model=schemas.ArticleDetailed)
async def getArticle(article: models.Article = Depends(getArticle)):
    return article

@app.patch("/project/{project_id}/article/{article_id}", response_model=schemas.ArticleDetailed)
async def setArticleName(new_name: str, article: models.Article = Depends(getArticle), db: Session = Depends(get_db)):
    article.name = new_name
    db.commit()
    return article

@app.delete("/project/{project_id}/article/{article_id}", response_model=schemas.ProjectDetailed)
async def deleteArticle(article: models.Article = Depends(getArticle), db: Session = Depends(get_db)):
    project = article.project
    db.delete(article)
    db.commit()
    return project




@app.post("/project/{project_id}/article/{article_id}/element", response_model=schemas.ElementWithId)
async def addElement(element: schemas.Element, article: models.Article = Depends(getArticle), db: Session = Depends(get_db)):
    new_element = models.Element(name=element.name, value=element.value)
    db.add(new_element)
    article.elements.append(new_element)
    db.commit()
    return new_element

@app.patch("/project/{project_id}/article/{article_id}/element/{element_id}", response_model=schemas.ElementWithId)
async def patchElement(new_element: schemas.Element, element: models.Element = Depends(getElement), db: Session = Depends(get_db)):
    element.name = new_element.name
    element.value = new_element.value
    db.commit()
    return element

@app.delete("/project/{project_id}/article/{article_id}/element/{element_id}", response_model=schemas.ArticleDetailed)
async def deleteElement(element: models.Element = Depends(getElement), db: Session = Depends(get_db)):
    article = element.article
    db.delete(element)
    db.commit()
    return article


@app.patch("/project/{project_id}/article/{article_id}/element/{element_id}/notes", response_model=schemas.ArticleDetailed)
async def patchNotes(notes: schemas.Notes, article: models.Article = Depends(getArticle), db: Session = Depends(get_db)):
    article.notes = notes.text
    db.commit()
    return article
