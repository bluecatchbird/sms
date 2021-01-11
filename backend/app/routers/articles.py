from fastapi import APIRouter, Depends, status, HTTPException
import uuid
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas import ArticleDetailed, ProjectWithId, ProjectDetailed
from ..models import Article, Project

from .projects import getProject

router = APIRouter()

async def getArticle(project_id: uuid.UUID, article_id: uuid.UUID, db: Session = Depends(get_db)):
    article = db.query(Article).join(Project, Project.id == project_id) \
        .filter(Article.id==article_id).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="article not found")
    return article


@router.post("/project/{project_id}/article", response_model=ArticleDetailed, tags=["article"])
async def createNewArticle(name: str, project: Project = Depends(getProject), db: Session = Depends(get_db)):
    new_article = Article(name=name)
    db.add(new_article)
    project.articles.append(new_article)
    db.commit()
    return new_article

@router.get("/project/{project_id}/article/{article_id}", response_model=ArticleDetailed, tags=["article"])
async def getArticleById(article: Article = Depends(getArticle)):
    return article

@router.patch("/project/{project_id}/article/{article_id}", response_model=ArticleDetailed, tags=["article"])
async def setArticleName(new_name: str, article: Article = Depends(getArticle), db: Session = Depends(get_db)):
    article.name = new_name
    db.commit()
    return article

@router.delete("/project/{project_id}/article/{article_id}", response_model=ProjectDetailed, tags=["article"])
async def deleteArticle(article: Article = Depends(getArticle), db: Session = Depends(get_db)):
    project = article.project
    db.delete(article)
    db.commit()
    return project