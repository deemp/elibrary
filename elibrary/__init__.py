from dataclasses import dataclass
from dotenv import dotenv_values
from pathlib import Path


@dataclass
class Env:
    SECRET_KEY: str
    DB_PATH: str
    DB_TABLE_BOOK: str
    ENABLE_AUTH: bool


env = Env(**dotenv_values(Path(__file__).parent / ".env"))
