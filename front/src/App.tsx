import { ReactElement, useEffect } from 'react'
import './App.css'
import { DropdownButton, DropdownItem, Form, Button, Navbar } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup';
import { Autocomplete, TextField } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

interface User {
  isAuthenticated: boolean
}

function Base({ title, user, content, nav }: { title: string, user: User, content: ReactElement, nav: ReactElement }) {
  useEffect(() => {
    document.title = title;
  });

  // TODO show error pages
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous" />
      <Navbar className="navbar-expand-lg navbar-dark bg-dark">
        <Button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbar">
          <span className="navbar-toggler-icon"></span>
        </Button>
        <div className="collapse navbar-collapse" id="navbar">
          <div className="navbar-nav">
            {
              user.isAuthenticated ?
                <>
                  {nav}
                </> :
                <>
                  <Link className="nav-item nav-link" id="login" to="/login">Login</Link>
                  <Link className="nav-item nav-link" id="register" to="/register">Register</Link>
                </>
            }
          </div>
        </div>
      </Navbar>
      <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
      <script src="https://kit.fontawesome.com/a93f01c655.js" crossOrigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossOrigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossOrigin="anonymous"></script>

      {content}
    </>

  )
}

interface Book {
  book_id: number
  title: string
  year: string
  authors: string
  publisher: string
  isbn: number
  format: string
}

function Search({ filters, books }: { filters: string[], books: Book[] }) {
  return (
    <>
      <div className='container'>
        <div className="mt-5">
          <div className="md-col-5">
            <InputGroup className="mb-3">
              <DropdownButton variant='outline-secondary' title='Select a filter' id='input-group-dropdown'>
                {filters.map(filter => <DropdownItem>{filter}</DropdownItem>)}
              </DropdownButton>
              <Form.Control placeholder='Type something' />
            </InputGroup>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={["Python", "C++", "Pascal", "Java", "C#"]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="bisac" />}
              className='mb-3'
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={["OOP", "FP", "PP", "TDD"]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="lc" />}
            />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Id</th>
              <th>Title</th>
              <th>Year</th>
              <th>Authors</th>
              <th>Publisher</th>
              <th>ISBN</th>
              <th>Format</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book =>
              <tr>
                <td>
                  <Link to={`book/${book.book_id}/read`}>Open</Link>
                </td>
                <td>{book.book_id}</td>
                <td>{book.title}</td>
                <td>{book.year}</td>
                <td>{book.authors}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.format}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

function SearchPage() {
  const books = [{
    book_id: 3,
    title: "aba",
    year: "2022",
    authors: "Karam",
    publisher: "Tsui",
    isbn: 102020330,
    format: "pdf"
  },
  {
    book_id: 5,
    title: "abai",
    year: "2022",
    authors: "Karam",
    publisher: "Tsui",
    isbn: 102020330,
    format: "pdf"
  }]
  const search = <Search filters={['isbn', 'year']} books={books} />
  const base = <Base title='Search' user={{ isAuthenticated: true }} content={search} nav={
    <Link className="nav-item nav-link" id="logout" to="/">Log out</Link>
  } />
  return base
}



function Book({ bookId }: { bookId: number, }) {
  return <iframe id="reader" src={
    `/pdfjs/web/viewer.html?file=${import.meta.env.VITE_API_PREFIX}/book/${bookId}/file`
  } />
}

function BookPage() {
  const { id } = useParams()
  if (id) {
    const bookId = Number.parseInt(id)
    const book = <Book bookId={bookId}></Book>
    const base = <Base title='Book' user={{ isAuthenticated: true }} content={book} nav={
      <Link className="nav-item nav-link" id="search" to="/">Search</Link>
    }></Base>
    return base
  } else {
    return <></>
  }
}

export { SearchPage, BookPage }
