from fastapi import APIRouter, Depends, status, HTTPException
import uuid
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas import ProjectDetailed, ProjectWithId
from ..models import Project

router = APIRouter()

async def getProject(project_id: uuid.UUID, db: Session = Depends(get_db)):
    project = db.query(Project).filter_by(id=project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="project not found")
    return project

async def getAllProjects(db: Session):
    projects = db.query(Project).all()
    return projects

@router.get("/project", response_model=List[ProjectWithId], tags=["project"])
async def getProjects(db: Session = Depends(get_db)):
   return await getAllProjects(db)

@router.post("/project", response_model=ProjectWithId, tags=["project"])
async def createNewProject(name: str, db: Session = Depends(get_db)):
    new_project = Project(name=name)
    db.add(new_project)
    db.commit()
    return new_project

@router.get("/project/{project_id}", response_model=ProjectDetailed, tags=["project"])
async def getProjectById(project: Project = Depends(getProject)):
    return project

@router.delete("/project/{project_id}", response_model=List[ProjectWithId], tags=["project"])
async def deleteProjectById(project: Project = Depends(getProject), db: Session = Depends(get_db)):
    db.delete(project)
    db.commit()
    return await getAllProjects(db)

@router.patch("/project/{project_id}", response_model=ProjectDetailed, tags=["project"])
async def setProjectName(new_name: str, project: Project = Depends(getProject), db: Session = Depends(get_db)):
    project.name = new_name
    db.commit()
    return project