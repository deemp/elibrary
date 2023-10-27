from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from .internal.db import create_db_and_tables
from contextlib import asynccontextmanager
from .routers import book, root, search, auth
from .routers import auth
from starlette.middleware.sessions import SessionMiddleware
from . import env


# https://fastapi.tiangolo.com/advanced/events/
@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

prefix = env.PREFIX

if env.ENABLE_AUTH:
    from . import auth_secrets
    # https://stackoverflow.com/a/73924330/11790403
    app.add_middleware(SessionMiddleware, secret_key=auth_secrets.SECRET_KEY)
    app.include_router(auth.router, prefix=prefix)

# https://fastapi.tiangolo.com/tutorial/static-files/
app.mount(f"{prefix}/static", StaticFiles(directory="elibrary/static/front/"), name="static")
app.mount(f"{prefix}/covers", StaticFiles(directory="covers"), name="covers")

# https://fastapi.tiangolo.com/tutorial/bigger-applications/
app.include_router(root.router, prefix=prefix)
app.include_router(book.router, prefix=prefix)
app.include_router(search.router, prefix=prefix)


@app.api_route("/{path:path}", methods=["GET"])
async def catch_all(path: str):
    return FileResponse("elibrary/static/front/index.html")
