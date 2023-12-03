from fastapi import APIRouter, Request
from fastapi.responses import FileResponse, RedirectResponse
from back.internal.check import MaybeRedirect

from .. import env

router = APIRouter()


@router.get("/")
async def root(request: Request, response: MaybeRedirect):
    if response:
        return response

    if list(request.query_params.keys()) != []:
        return RedirectResponse(url="/")

    return FileResponse(f"{env.FRONT_DIR}/index.html")
