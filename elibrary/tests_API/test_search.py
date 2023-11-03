import requests

def test_search_get():
    r = requests.get('http://localhost:5000/search')
    r.json()
    print(r)


def test_search_post():
    r = requests.post('http://localhost:5000/search', {'', '', []})
    r.json()
    print(r)
