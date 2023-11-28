{ env }: {
  ENV = env;
  DB_PATH = "${env}.db";
  DB_DUMP_PATH = "${env}.sql";
}
