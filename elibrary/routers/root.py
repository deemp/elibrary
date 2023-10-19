from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()

@router.get("/")
def home():
    with open("elibrary/static/front/index.html", 'r') as index:
        return HTMLResponse(index.read())
