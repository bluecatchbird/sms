from sqlalchemy import Column, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy_utils import UUIDType
from app.db.database import Base
from typing import List
import uuid

class BaseForItems():
    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)

class Image(Base):
    __tablename__ = 'Image'
    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    original_file_name = Column(String, nullable=False)
    storage_path = Column(String, default="")
    article_id = Column(UUIDType(binary=False), ForeignKey('Article.id'))
    article = relationship("Article", backref="images")

class Element(Base, BaseForItems):
    __tablename__ = 'Elements'
    value = Column(String, nullable=False)
    article_id = Column(UUIDType(binary=False), ForeignKey('Article.id'))
    article = relationship("Article", backref="elements")

class Article(Base, BaseForItems):
    __tablename__ = 'Article'
    notes = Column(Text, default="")
    project_id = Column(UUIDType(binary=False), ForeignKey('Project.id'))
    project = relationship("Project", backref="articles")
    
class Project(Base, BaseForItems):
    __tablename__ = 'Project'
