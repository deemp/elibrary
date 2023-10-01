create table if not exists books (
    id integer primary key autoincrement,
    name varchar(50),
    author varchar(50));
insert into books
    (name, author) values
    ("C++ is the greatest language", "Bjarne Stroustrup");