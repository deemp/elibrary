from fastapi import Depends, Request
from fastapi.responses import RedirectResponse
from .. import env

def check_session(request: Request):
    if env.ENABLE_AUTH and not request.session.get("user"):
        return RedirectResponse(url="/login")
    return None

check = Depends(check_session)