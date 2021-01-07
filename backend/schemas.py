from datetime import date
from pydantic import BaseModel
import uuid
from typing import List

class Element(BaseModel):
    name: str
    value: str

    class Config:
        orm_mode = True

class ElementWithId(Element):
    id: uuid.UUID

class Article(BaseModel):
    name: str
    elements: List[Element]

    class Config:
        orm_mode = True

class ArticleWithId(BaseModel):
    id: uuid.UUID
    name: str
    project_id: uuid.UUID

    class Config:
        orm_mode = True

class ArticleDetailed(ArticleWithId):
    elements: List[ElementWithId] = None

    class Config:
        orm_mode = True

class Project(BaseModel):
    name: str

    class Config:
        orm_mode = True

class ProjectWithId(Project):
    id: uuid.UUID

class ProjectDetailed(ProjectWithId):
    articles: List[ArticleWithId] = None
