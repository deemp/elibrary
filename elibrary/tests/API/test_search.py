import requests


def test_search_get():
    response = requests.get('http://0.0.0.0:5000/api/search')
    print(response.json())
