import requests

from elibrary.routers.search import SearchPOSTRequest


def test_search_get():
    r = requests.get("http://localhost:5000/api/search")
    r.json()
    print(r)


def test_search_post():
    r = requests.post(
        "http://localhost:5000/api/search",
        SearchPOSTRequest(bisac="", lc="", filter_rows=[]).json(),
    )
    r.json()
    print(r)
