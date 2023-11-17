from fastapi import APIRouter
from fastapi.responses import FileResponse
from back.internal.check import MaybeRedirect

from .. import env

router = APIRouter()


@router.get("/")
async def root(response: MaybeRedirect):
    if response:
        return response
    return FileResponse(f"{env.FRONT_DIR}/index.html")
