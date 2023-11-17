from fastapi import APIRouter, Request
from fastapi.responses import FileResponse, RedirectResponse
from .. import env

router = APIRouter()


@router.get("/")
async def root(request: Request):
    if env.ENABLE_AUTH and not request.session.get("user"):
        return RedirectResponse(url="/login")
    return FileResponse(f"{env.FRONT_DIR}/index.html")
