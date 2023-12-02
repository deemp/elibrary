import { termsObject } from "./terms";

export interface Book {
  bisac: string;
  lc: string;
  publisher: string;
  year: number;
  book_id: number;
  authors: string;
  title: string;
  imprint_publisher: string;
  isbn: number;
  esbn: number;
  oclc: number;
  lcc: string;
  dewey: number;
  format: string;
  pages: number;
  cover_url?: string;
}

export interface BookSearch {
  book_id: number;
  title: string;
  authors: string;
  publisher: string;
  year: number;
  isbn: number;
  bisac: string;
  lc: string;
}

const rename: [string, string][] = Object.entries(termsObject).map(([key, value]) => [key, value.pretty])

const renameInverse: [string, string][] = rename.map(([a, b]) => [b, a])

export const bookPretty = new Map<string, string>(rename)
export const bookPrettyInverse = new Map<string, string>(renameInverse)