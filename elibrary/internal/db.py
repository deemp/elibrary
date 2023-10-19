from sqlalchemy import create_engine
from sqlmodel import SQLModel
from .. import env

sqlite_url = f"sqlite:///{env.DB_PATH}"

engine = create_engine(sqlite_url, echo=True, connect_args={"check_same_thread": False})


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
