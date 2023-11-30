from dataclasses import dataclass
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
    DB_DUMP_PATH: str

    DO_EXTRACT_COVERS: bool
    POPPLER_PATH: str
    BOOKS_DIR: str
    COVERS_DIR: str

    FRONT_DIR: str

    HOST: str
    PORT_BACK: int

    LOG_CONFIG_PATH: str

    OPENID_CONFIG_URL: str

    REDIRECT_URL: str

    DO_RELOAD: bool

    ENV: str

    OTLP_GRPC_ENDPOINT: str

    DEV: bool
    PROD: bool

    APP_NAME: str

    SEARCH_RESULTS_MAX: str

    def __post_init__(self):
        self.ENABLE_AUTH = self.ENABLE_AUTH == "true"
        self.DO_IMPORT_CATALOG = self.DO_IMPORT_CATALOG == "true"
        self.DO_EXTRACT_COVERS = self.DO_EXTRACT_COVERS == "true"
        self.PORT_BACK = int(self.PORT_BACK)
        self.URL = f"http://{self.HOST}:{self.PORT_BACK}{self.PREFIX}"
        self.DO_RELOAD = self.DO_RELOAD == "true"
        self.DEV = self.ENV == "development"
        self.PROD = self.ENV == "production"
        self.SEARCH_RESULTS_MAX = int(self.SEARCH_RESULTS_MAX)


def load_env(cls):
    # https://stackoverflow.com/a/50874478
    return cls(**{field: os.environ.get(field) for field in cls.__dataclass_fields__})


env = load_env(Env)

if env.ENABLE_AUTH:

    @dataclass
    class Auth:
        AppID: str
        Secret: str

        SECRET_KEY: str

    auth_secrets = load_env(Auth)
