from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
import uuid
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas import ProjectDetailed, ProjectWithId, ArticleDetailed
from ..models import Project, Image, Article

from .articles import getArticle

import os

from pathlib import Path

router = APIRouter()


async def getImage(project_id: uuid.UUID, article_id: uuid.UUID, image_id: uuid.UUID, db: Session = Depends(get_db)):
    image = db.query(Image) \
        .join(Article, Article.id == article_id) \
        .join(Project, Project.id == project_id) \
        .filter(Article.id==article_id) \
        .filter(Project.id==project_id).first()
    if not image:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="image not found")
    return image


@router.post("/project/{project_id}/article/{article_id}/image", response_model=ArticleDetailed, tags=["image"])
async def addImage(image: UploadFile = File(...), article: Article = Depends(getArticle), db: Session = Depends(get_db)):
    extension = os.path.splitext(image.filename)[1]
    if extension.lower() not in [".png", ".jpg", ".jpeg"]:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="file type not supported: %s" % extension)

    new_image = Image()
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

@router.delete("/project/{project_id}/article/{article_id}/image/{image_id}", response_model=ArticleDetailed, tags=["image"])
async def deleteImage(image: Image = Depends(getImage), db: Session = Depends(get_db)):
    article = image.article
    db.delete(image)
    db.commit()
    return article

@router.get("/project/{project_id}/article/{article_id}/image/{image_id}", tags=["image"])
async def getImageById(image: Image = Depends(getImage)):
    return FileResponse(image.storage_path)

