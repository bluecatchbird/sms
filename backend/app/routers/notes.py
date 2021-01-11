from fastapi import APIRouter, Depends, status, HTTPException
import uuid
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas import ArticleDetailed, Notes
from ..models import Project, Article

from .articles import getArticle

router = APIRouter()

@router.patch("/project/{project_id}/article/{article_id}/notes", response_model=ArticleDetailed, tags=["notes"])
async def patchNotes(notes: Notes, article: Article = Depends(getArticle), db: Session = Depends(get_db)):
    article.notes = notes.text
    db.commit()
    return article