from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .internal.db import create_db_and_tables
from contextlib import asynccontextmanager
from .routers import book, root, search

# https://fastapi.tiangolo.com/advanced/events/


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    yield


# https://fastapi.tiangolo.com/tutorial/static-files/

app = FastAPI(lifespan=lifespan)
app.mount("/static", StaticFiles(directory="elibrary/static/front/"), name="static")

# https://fastapi.tiangolo.com/tutorial/bigger-applications/
app.include_router(root.router)
app.include_router(book.router)
app.include_router(search.router)
