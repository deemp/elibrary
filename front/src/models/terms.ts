export interface Term {
  name: string;
  definition: string;
  link: string;
  pretty: string
}

export const termsObject = Object.fromEntries(Object.entries({
  bisac: {
    definition:
      "a set of subject headings that were created by the Book Industry Study Group and is the system used in many bookstores.",
    link: "https://en.wikipedia.org/wiki/BISAC_Subject_Headings",
    pretty: "Category"
  },
  lc: {
    definition: "arranges books by subject",
    link: "https://www.farmingdale.edu/library/lcclass.shtml",
    pretty: "Subject"
  },
  imprint_publisher: {
    definition: "trade name under which a publisher publishes a work",
    link: "https://en.wikipedia.org/wiki/Imprint_(trade_name)",
    pretty: "Imprint"
  },
  isbn: {
    definition: "a unique numeric commercial book identifier",
    link: "https://en.wikipedia.org/wiki/ISBN",
    pretty: "ISBN"
  },
  esbn: {
    definition: "a unique numeric educational book identifier",
    link: "https://esbn-international.com/esbn/",
    pretty: "ESBN"
  },
  oclc: {
    definition: "identifier for a unique bibliographic record in OCLC WorldCat",
    link: "https://www.wikidata.org/wiki/Property:P243",
    pretty: "OCN"
  },
  lcc: {
    definition:
      "a system of library classification developed by the Library of Congress in the United States",
    link: "https://en.wikipedia.org/wiki/Library_of_Congress_Classification",
    pretty: "LCC"
  },
  dewey: {
    definition:
      "a classification number that locates a particular volume in a position relative to other books in the library",
    link: "https://en.wikipedia.org/wiki/Dewey_Decimal_Classification#Design",
    pretty: "Dewey"
  },
  book_id: {
    definition: "",
    link: "",
    pretty: "Book ID"
  },
  title: {
    definition: "",
    link: "",
    pretty: "Title"
  },
  authors: {
    definition: "",
    link: "",
    pretty: "Author(s)"
  },
  publisher: {
    definition: "",
    link: "",
    pretty: "Publisher"
  },
  year: {
    link: "",
    definition: "Publishing year",
    pretty: "Year"
  },
}).map(([key, value]) => [key, { ...value, name: key }]))