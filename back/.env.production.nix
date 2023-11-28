{ env }: {
  ENABLE_AUTH = "false";
  DO_RELOAD = "false";
  ENV = env;
  OPENID_CONFIG_URL = "https://sso.university.innopolis.ru/adfs/.well-known/openid-configuration";
  REDIRECT_URL = "https://ebsco.library.innopolis.university/auth";
  LOG_CONFIG_PATH = "back/log_conf.yaml";
  DB_PATH = "${env}.db";
  DB_DUMP_PATH = "${env}.sql";
  APP_NAME = "app-elibrary";
  OTLP_GRPC_ENDPOINT = "http://tempo:4317";
}
