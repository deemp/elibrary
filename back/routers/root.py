from fastapi import APIRouter
from fastapi.responses import FileResponse

from .. import env

router = APIRouter()


@router.get("/")
async def root():
    return FileResponse(f"{env.FRONT_DIR}/index.html")
