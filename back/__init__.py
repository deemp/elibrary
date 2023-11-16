from dataclasses import dataclass
from dotenv import dotenv_values
from pathlib import Path
import os


@dataclass
class Env:
    DB_PATH: str
    DB_TABLE_BOOK: str
    ENABLE_AUTH: bool
    PREFIX: str

    DO_IMPORT_CATALOG: bool
    XLSX_PATH: str
    SHEET: str
    SQL_DUMP_PATH: str

    DO_EXTRACT_COVERS: bool
    POPPLER_PATH: str
    BOOKS_DIR: str
    COVERS_DIR: str

    FRONT_DIR: str
    
    HOST: str
    PORT: int
    
    LOG_CONFIG_PATH: str
    
    DO_RELOAD: bool
    
    ENV: str
    
    OTLP_GRPC_ENDPOINT: str
    APP_NAME: str

    def __post_init__(self):
        self.ENABLE_AUTH = self.ENABLE_AUTH == "true"
        self.DO_IMPORT_CATALOG = self.DO_IMPORT_CATALOG == "true"
        self.DO_EXTRACT_COVERS = self.DO_EXTRACT_COVERS == "true"
        self.PORT = int(self.PORT)
        self.URL = f"http://{self.HOST}:{self.PORT}{self.PREFIX}"
        self.DO_RELOAD = self.ENV == "dev"

def load_dotenv(cls, path):
    # https://github.com/theskumar/python-dotenv#other-use-cases
    config = {**dotenv_values(Path(__file__).parent / path), **os.environ}
    # https://stackoverflow.com/a/50874478
    return cls(**{field: config.get(field) for field in cls.__dataclass_fields__})

env = load_dotenv(Env, ".env")

if env.ENABLE_AUTH:

    @dataclass
    class Auth:
        SECRET_KEY: str
        GOOGLE_CLIENT_ID: str
        GOOGLE_CLIENT_SECRET: str
    auth_secrets = load_dotenv(Auth, "auth.env")
