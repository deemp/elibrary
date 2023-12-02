from fastapi import APIRouter
from pydantic import BaseModel
from back.internal.check import MaybeRedirect

from .. import env

router = APIRouter()


class HelpGETResponse(BaseModel):
    search_results_max: int


@router.get("/help")
async def info(response: MaybeRedirect):
    if response:
        return response
    return HelpGETResponse(search_results_max=env.SEARCH_RESULTS_MAX)
