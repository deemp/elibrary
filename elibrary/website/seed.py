from sqlalchemy import text

create_table_script = text("""
                create table if not exists book (
                    bisac       varchar(50),
                    lc          varchar(50),
                    publisher   varchar(50),
                    year        int,
                    book_id     integer primary key autoincrement,
                    authors     varchar(50),
                    title       varchar(300),
                    print_hub   varchar(50),
                    isbn        bigint,
                    esbn        bigint,
                    format      varchar(50));
            """)
sql1 = text("""
                insert into book (bisac, lc, publisher, year, authors, title, print_hub, isbn, esbn, format)
                    values (
                    'LANGUAGES',
                    'C++',
                    'Bjarne Stroustrup inc.',
                    1810,
                    'Bjarne Stroustrup',
                    'Why C++ is best language',
                    'languages',
                    1101,
                    10001,
                    'PDF');
            """)

sql2 = text("""
                insert into book (bisac, lc, publisher, year, authors, title, print_hub, isbn, esbn, format)
                    values (
                    'LANGUAGES',
                    'Python',
                    'Bjarne Stroustrup dec.',
                    2003,
                    'Bjarne Stroustrup',
                    'Why Python is bad language',
                    'languages',
                    1102,
                    66601,
                    'PDF');
            """)

sql3 = text("""
            insert into book (bisac, lc, publisher, year, authors, title, print_hub, isbn, esbn, format)
                values (
                'LANGUAGES',
                'Eiffel',
                'Check',
                1972,
                'Bertrand Meyer',
                'Contract programming is good',
                'languages',
                2032,
                32421,
                'PDF');
        """)

sql4 = text("""
            insert into book (bisac, lc, publisher, year, authors, title, print_hub, isbn, esbn, format)
                values (
                'LANGUAGES',
                'Python',
                'Agilovo',
                2021,
                'Agiler',
                'Learn, how to develop in Python correctly',
                'languages',
                4251,
                43524,
                'PY');
        """)

list_of_seeds = [sql1, sql2, sql3, sql4]
