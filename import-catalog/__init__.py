from dataclasses import dataclass
from dotenv import dotenv_values
from pathlib import Path

@dataclass
class Env:
    XLSX: str
    SHEET: str
    SQL: str

    DB_PATH: str
    DB_TABLE_BOOK: str


env = Env(**dotenv_values(Path(__file__).parent / ".env"))
