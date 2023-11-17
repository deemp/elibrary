from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from .internal.db import create_db_and_tables
from contextlib import asynccontextmanager
from .routers import book, root, search, auth
from .routers import auth
from starlette.middleware.sessions import SessionMiddleware
from . import env
from .internal.import_catalog import import_catalog
from .internal.extract_covers import extract_covers
from .internal.otlp import PrometheusMiddleware, metrics, setting_otlp
import logging
from .internal.check import check


# https://fastapi.tiangolo.com/advanced/events/
@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    if env.DO_IMPORT_CATALOG:
        import_catalog()
    if env.DO_EXTRACT_COVERS:
        extract_covers()
    yield


app = FastAPI(lifespan=lifespan)

if env.ENV == "prod":
    # Setting metrics middleware
    app.add_middleware(PrometheusMiddleware, app_name=env.APP_NAME)
    app.add_route("/metrics", metrics)

    # Setting OpenTelemetry exporter
    setting_otlp(app, env.APP_NAME, env.OTLP_GRPC_ENDPOINT)


class EndpointFilter(logging.Filter):
    # Uvicorn endpoint access log filter
    def filter(self, record: logging.LogRecord) -> bool:
        return record.getMessage().find("GET /metrics") == -1


# Filter out /endpoint
logging.getLogger("uvicorn.access").addFilter(EndpointFilter())


prefix = env.PREFIX

if env.ENABLE_AUTH:
    from . import auth_secrets

    # https://stackoverflow.com/a/73924330/11790403
    app.add_middleware(SessionMiddleware, secret_key=auth_secrets.SECRET_KEY)
    app.include_router(auth.router, prefix="" if env.PROD else prefix)

# https://fastapi.tiangolo.com/tutorial/static-files/
app.mount(
    f"{prefix}/static",
    StaticFiles(directory=env.FRONT_DIR, follow_symlink=True),
    name="static",
)
app.mount(
    f"{prefix}/covers",
    StaticFiles(directory=env.COVERS_DIR, follow_symlink=True),
    name="covers",
)

# https://fastapi.tiangolo.com/tutorial/bigger-applications/
app.include_router(root.router, prefix="" if env.PROD else prefix, dependencies=[check])
app.include_router(book.router, prefix=prefix)
app.include_router(search.router, prefix=prefix, dependencies=[check])


@app.get("/{path:path}", dependencies=[check])
async def catch_all():
    return FileResponse(f"{env.FRONT_DIR}/index.html")


def run():
    uvicorn.run(
        f"{__name__}:app",
        port=env.PORT,
        host=env.HOST,
        reload=env.DO_RELOAD,
        **({"log_config": env.LOG_CONFIG_PATH} if env.ENV == "prod" else {}),
    )


if __name__ == "__main__":
    run()
