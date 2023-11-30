{ pkgs }:
{
  DB_TABLE_BOOK = "book";
  PREFIX = "/api";

  DO_IMPORT_CATALOG = "true";
  XLSX_PATH = "books.xlsx";
  SHEET = "books";

  DO_EXTRACT_COVERS = "false";
  POPPLER_PATH = "${pkgs.poppler_utils}/bin";
  BOOKS_DIR = "books";
  COVERS_DIR = "covers";

  FRONT_DIR = "back/static/front";

  DO_RELOAD = "true";

  SEARCH_RESULTS_MAX = "100";

  UTC_OFFSET = "3";
}
