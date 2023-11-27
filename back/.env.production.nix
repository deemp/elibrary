rec {
  DO_RELOAD = "false";
  ENV = "production";
  OPENID_CONFIG_URL = "https://sso.university.innopolis.ru/adfs/.well-known/openid-configuration";
  REDIRECT_URL = "https://test.library.innopolis.university/auth";
  LOG_CONFIG_PATH = "back/log_conf.yaml";
  DB_PATH = "${ENV}.db";
  DB_DUMP_PATH = "${ENV}.sql";
  APP_NAME = "app-elibrary";
  OTLP_GRPC_ENDPOINT = "http://tempo:4317";
}
