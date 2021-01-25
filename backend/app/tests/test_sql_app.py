from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app, get_db
from app.db.database import Base


SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_project():
    response = client.post(
        "/project/",
        json={"name": "test"}
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["name"] == "test"
    assert "id" in data
    project_id = data["id"]

    response = client.get(f"/project/{project_id}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["name"] == "test"
    assert data["id"] == project_id