from fastapi import APIRouter, Depends, status, HTTPException
import uuid
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas import ProjectDetailed, ProjectWithId, ArticleDetailed, ElementWithId
from ..models import Project, Element, Article

from .articles import getArticle

router = APIRouter()

async def getElement(project_id: uuid.UUID, article_id: uuid.UUID, element_id: uuid.UUID, db: Session = Depends(get_db)):
    element = db.query(Element) \
        .join(Project, Project.id == project_id) \
        .join(Article, Article.id == article_id) \
        .filter(Element.id==element_id).first()
    if not element:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="element not found")
    return element

# @router.post("/project/{project_id}/article/{article_id}/element", response_model=ElementWithId, tags=["element"])
# async def addElement(element: Element, article: Article = Depends(getArticle), db: Session = Depends(get_db)):
#     new_element = Element(name=element.name, value=element.value)
#     db.add(new_element)
#     article.elements.append(new_element)
#     db.commit()
#     return new_element

# @router.patch("/project/{project_id}/article/{article_id}/element/{element_id}", response_model=ElementWithId, tags=["element"])
# async def patchElement(new_element: Element, element: Element = Depends(getElement), db: Session = Depends(get_db)):
#     element.name = new_element.name
#     element.value = new_element.value
#     db.commit()
#     return element

# @router.delete("/project/{project_id}/article/{article_id}/element/{element_id}", response_model=ArticleDetailed, tags=["element"])
# async def deleteElement(element: Element = Depends(getElement), db: Session = Depends(get_db)):
#     article = element.article
#     db.delete(element)
#     db.commit()
#     return article