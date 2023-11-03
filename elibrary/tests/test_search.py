from ..routers.search import *


def test_search_get_type():
    assert type(search_get()) == SearchGETResponse


def test_search_get_bisac_type():
    response = search_get()
    for key in response.bisac:
        assert type(key) == str
        for value in response.bisac[key]:
            assert(type(value) == str)


def test_search_get_lc_type():
    response = search_get()
    for key in response.lc:
        assert type(key) == str
        for value in response.lc[key]:
            assert(type(value) == str)


def test_search_get_bisac_value():
    response = search_get()
    for key in response.bisac:
        response.bisac[key].sort()
    assert response.bisac == {
        'SOCIAL SCIENCE': ['Sociology / General'], 
        'SCIENCE': ['Applied Sciences'], 
        'LANGUAGE ARTS & DISCIPLINES': ['Communication Studies', 'Linguistics / General'], 
        'MATHEMATICS': ['General'], 
        'POLITICAL SCIENCE': ['World / Middle Eastern'], 
        'BUSINESS & ECONOMICS': ['Advertising & Promotion', 'General']
    }


def test_search_get_lc_value():
    response = search_get()
    for key in response.bisac:
        response.lc[key].sort()
    assert response.lc == {
        'Sociology / General': ['SOCIAL SCIENCE'], 
        'Applied Sciences': ['SCIENCE'], 
        'Linguistics / General': ['LANGUAGE ARTS & DISCIPLINES'], 
        'General': ['BUSINESS & ECONOMICS', 'MATHEMATICS'], 
        'World / Middle Eastern': ['POLITICAL SCIENCE'], 
        'Communication Studies': ['LANGUAGE ARTS & DISCIPLINES'], 
        'Advertising & Promotion': ['BUSINESS & ECONOMICS']
    }


def test_search_get_filters_value():
    assert search_get().filters == ["publisher", "year", "authors", "title", "isbn", "esbn", "format"]


def test_search_post_type():
    request = SearchPOSTRequest(bisac="", lc="", filter_rows=[])
    response = search_post(request)
    assert type(response) == SearchPOSTResponse


def test_search_post_content_empty():
    request = SearchPOSTRequest(bisac="", lc="", filter_rows=[])
    response = search_post(request)
    #assert response.books == [...]


def test_search_post_content_bisac():
    request = SearchPOSTRequest(
        bisac="LANGUAGE ARTS & DISCIPLINES", lc="", filter_rows=[]
    )
    response = search_post(request)
    #assert response.books == [...]


def test_search_post_content_lc():
    request = SearchPOSTRequest(bisac="", lc="Linguistics / General", filter_rows=[])
    response = search_post(request)
    #assert response.books == [...]


def test_search_post_content_filter():
    request = SearchPOSTRequest(
        bisac="", lc="", filter_rows=[FilterRow(filter="year", filter_input="2018")]
    )
    response = search_post(request)
    #assert response.books == [...]
