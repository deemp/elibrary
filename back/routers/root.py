from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from .. import env

router = APIRouter()


@router.get("/")
async def root(request: Request):
    if env.ENABLE_AUTH:
        user = request.session.get("user")
        if user:
            with open(f"{env.FRONT_DIR}/index.html", "r") as index:
                return HTMLResponse(index.read())
        return RedirectResponse(url="/login")
    else:
        with open(f"{env.FRONT_DIR}/index.html", "r") as index:
            return HTMLResponse(index.read())