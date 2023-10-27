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
  cover_url?: string;
}

const rename: [string, string][] = [
  ['bisac', 'Category'],
  ['lc', 'Subject'],
  ['publisher', 'Publisher'],
  ['year', 'Year'],
  ['book_id', 'Book ID'],
  ['authors', 'Author(s)'],
  ['title', 'Title'],
  ['imprint_publisher', 'Imprint'],
  ['isbn', 'ISBN'],
  ['esbn', 'ESBN'],
  // OCLC Control Number - https://www.wikidata.org/wiki/Property:P243
  ['oclc', 'OCN'],
  ['lcc', 'LCC'],
  ['dewey', 'Dewey'],
  ['format', 'Format'],
]

const renameInverse: [string, string][] = rename.map(([a, b]) => [b, a])

export const bookPretty = new Map<string, string>(rename)
export const bookPrettyInverse = new Map<string, string>(renameInverse)