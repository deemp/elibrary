{ pkgs }:
{
  ENABLE_AUTH = "false";
  DB_PATH = "database.db";
  DB_TABLE_BOOK = "book";
  PREFIX = "/api";

  DO_IMPORT_CATALOG = "true";
  XLSX_PATH = "books.xlsx";
  SHEET = "Sheet1";
  SQL_DUMP_PATH = "database.sql";

  DO_EXTRACT_COVERS = "false";
  POPPLER_PATH = "${pkgs.poppler_utils}/bin";
  BOOKS_DIR = "books";
  COVERS_DIR = "covers";

  FRONT_DIR = "back/static/front";
}
