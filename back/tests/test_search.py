import requests
from ..routers.search import *
from .. import env
from ..routers.search import filters

search_url = f"{env.URL}/search"

def test_search_get_type():
    assert type(search_get()) == SearchGETResponse


def test_search_get_bisac_type():
    response = search_get()
    for key in response.bisac:
        assert type(key) == str
        for value in response.bisac[key]:
            assert type(value) == str


def test_search_get_lc_type():
    response = search_get()
    for key in response.lc:
        assert type(key) == str
        for value in response.lc[key]:
            assert type(value) == str


def test_search_post_type():
    request = SearchPOSTRequest(bisac="", lc="", filter_rows=[])
    response = search_post(request)
    assert type(response) == SearchPOSTResponse


class TestSearchGetBisacValue:
    def check(self, response: SearchGETResponse):
        for key in response.bisac:
            response.bisac[key].sort()
        assert response.bisac == {
            "SOCIAL SCIENCE": ["Sociology / General"],
            "SCIENCE": ["Applied Sciences"],
            "LANGUAGE ARTS & DISCIPLINES": [
                "Communication Studies",
                "Linguistics / General",
            ],
            "MATHEMATICS": ["General"],
            "POLITICAL SCIENCE": ["World / Middle Eastern"],
            "BUSINESS & ECONOMICS": ["Advertising & Promotion", "General"],
        }

    def test_unit(self):
        response = search_get()
        self.check(response)

    def test_api(self):
        response = requests.get(search_url)
        self.check(SearchGETResponse(**response.json()))


class TestSearchGetLcValue:
    def check(self, response: SearchGETResponse):
        for key in response.lc:
            response.lc[key].sort()
        assert response.lc == {
            "Sociology / General": ["SOCIAL SCIENCE"],
            "Applied Sciences": ["SCIENCE"],
            "Linguistics / General": ["LANGUAGE ARTS & DISCIPLINES"],
            "General": ["BUSINESS & ECONOMICS", "MATHEMATICS"],
            "World / Middle Eastern": ["POLITICAL SCIENCE"],
            "Communication Studies": ["LANGUAGE ARTS & DISCIPLINES"],
            "Advertising & Promotion": ["BUSINESS & ECONOMICS"],
        }

    def test_unit(self):
        response = search_get()
        self.check(response)

    def test_api(self):
        response = requests.get(search_url)
        self.check(SearchGETResponse(**response.json()))


class TestSearchGetFiltersValue:
    def check(self, response: SearchGETResponse):
        assert response.filters == filters

    def test_unit(self):
        response = search_get()
        self.check(response)

    def test_api(self):
        response = requests.get(search_url)
        self.check(SearchGETResponse(**response.json()))


class TestSearchPostContentEmpty:
    request = SearchPOSTRequest(bisac="", lc="", filter_rows=[])

    def check(self, response: SearchPOSTResponse):
        assert len(response.books) == 10

    def test_unit(self):
        response = search_post(self.request)
        self.check(response)

    def test_api(self):
        response = requests.post(
            search_url,
            self.request.json(),
        )
        self.check(SearchPOSTResponse(**response.json()))


class TestSearchPostContentBisac:
    request = SearchPOSTRequest(
        bisac="LANGUAGE ARTS & DISCIPLINES", lc="", filter_rows=[]
    )

    def check(self, response: SearchPOSTResponse):
        assert len(response.books) == 4

    def test_unit(self):
        response = search_post(self.request)
        self.check(response)

    def test_api(self):
        response = requests.post(
            search_url,
            self.request.json(),
        )
        self.check(SearchPOSTResponse(**response.json()))


class TestSearchPostContentLc:
    request = SearchPOSTRequest(bisac="", lc="Linguistics / General", filter_rows=[])

    def check(self, response: SearchPOSTResponse):
        assert len(response.books) == 3

    def test_unit(self):
        response = search_post(self.request)
        self.check(response)

    def test_api(self):
        response = requests.post(
            search_url,
            self.request.json(),
        )
        self.check(SearchPOSTResponse(**response.json()))


class TestSearchPostContentFilter:
    request = SearchPOSTRequest(
        bisac="", lc="", filter_rows=[FilterRow(filter="year", filter_input="2018")]
    )

    def check(self, response: SearchPOSTResponse):
        assert len(response.books) == 3

    def test_unit(self):
        response = search_post(self.request)
        self.check(response)

    def test_api(self):
        response = requests.post(
            search_url,
            self.request.json(),
        )
        self.check(SearchPOSTResponse(**response.json()))
