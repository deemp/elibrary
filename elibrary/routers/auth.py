# https://blog.authlib.org/2020/fastapi-google-login

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth, OAuthError
from .. import env

if env.ENABLE_AUTH:
    from .. import auth_secrets

    oauth = OAuth()
    config = Config(
        environ={
            "GOOGLE_CLIENT_ID": auth_secrets.GOOGLE_CLIENT_ID,
            "GOOGLE_CLIENT_SECRET": auth_secrets.GOOGLE_CLIENT_SECRET,
        }
    )
    oauth = OAuth(config)
    oauth.register(
        name="google",
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )

    router = APIRouter()


    @router.get("/login")
    async def login(request: Request):
        redirect_uri = request.url_for("auth")
        return await oauth.google.authorize_redirect(request, redirect_uri)


    @router.get("/auth")
    async def auth(request: Request):
        try:
            token = await oauth.google.authorize_access_token(request)
        except OAuthError as error:
            return HTMLResponse(f"<h1>{error.error}</h1>")
        user = token.get("userinfo")
        if user:
            request.session["user"] = dict(user)
        return RedirectResponse(url="/")


    @router.get("/logout")
    async def logout(request: Request):
        request.session.pop("user", None)
        return RedirectResponse(url="/")
