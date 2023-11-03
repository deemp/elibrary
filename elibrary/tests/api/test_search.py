import requests

from elibrary.routers.search import SearchPOSTRequest


def test_search_get():
    response = requests.get("http://localhost:5000/api/search")
    print(response.json())


def test_search_post():
    r = requests.post(
        "http://localhost:5000/api/search", {"bisac": "", "lc": "", "filter_rows": []}
    )
    r.json()
    print(r)
