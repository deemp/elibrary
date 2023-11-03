from dataclasses import dataclass
from dotenv import dotenv_values
from pathlib import Path


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

    def __post_init__(self):
        self.ENABLE_AUTH = self.ENABLE_AUTH == "true"
        self.DO_IMPORT_CATALOG = self.DO_IMPORT_CATALOG == "true"
        self.DO_EXTRACT_COVERS = self.DO_EXTRACT_COVERS == "true"


env = Env(**dotenv_values(Path(__file__).parent / ".env"))

if env.ENABLE_AUTH:

    @dataclass
    class Auth:
        SECRET_KEY: str
        GOOGLE_CLIENT_ID: str
        GOOGLE_CLIENT_SECRET: str

    auth_secrets = Auth(**dotenv_values(Path(__file__).parent / "auth.env"))
