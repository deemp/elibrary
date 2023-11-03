import requests


def test_book_page():
    response = requests.get('http://0.0.0.0:5000/api/book/1081010')
    assert response.json() == {
        'lc': 'Applied Sciences', 
        'publisher': 'CRC Press (Unlimited)', 
        'book_id': 1081010, 
        'title': 'Precision Agriculture Technology for Crop Farming', 
        'isbn': 9781482251074, 
        'oclc': 924717252, 
        'dewey': 631.0, 
        'pages': 382, 
        'year': 2016, 
        'bisac': 'SCIENCE', 
        'authors': 'Qin Zhang', 
        'imprint_publisher': 'CRC Press', 
        'esbn': 9781482251081, 
        'lcc': 'S494.5.P73 P742 2015eb', 
        'format': 'EPUB;PDF', 
        'reads': 0}
    

def test_book_page_fail():
    response = requests.get('http://0.0.0.0:5000/api/book/1')
    assert response.json() == {"detail":"Book not found"}
