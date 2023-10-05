function instantiateBookReader(url, selector, extraOptions) {
    selector = selector || '#BookReader';
    extraOptions = extraOptions || {};
    bookUrl = `${url}images/000001`
    mkPage = pageNumber => {
        return {
            width: 800, height: 1200,
            uri: `${bookUrl}/page-0${pageNumber}.jpg`
        }
    }
    mkPages = pageNumbers => {
        return pageNumbers.map(n => { return mkPage(n) })
    }
    var options = {
        ppi: 100,
        data: [[21], [22, 23], [24, 25], [26, 27]].map(ns => { return mkPages(ns) }),

        // Book title and the URL used for the book title link
        bookTitle: 'BookReader Demo',

        // Metadata is optional, but it is used in the info dialog
        metadata: [
            { label: 'Title', value: 'Open Library BookReader Presentation' },
            { label: 'Author', value: 'Internet Archive' },
            { label: 'Demo Info', value: 'This demo shows how one could use BookReader with their own content.' },
        ],

        // Override the path used to find UI images
        imagesBaseURL: 'https://cdn.jsdelivr.net/npm/@elibrary-inno/bookreader@latest/BookReader/images/',

        ui: 'full', // embed, full (responsive)

        el: selector,
    };
    $.extend(options, extraOptions);
    var br = new BookReader(options);
    br.init();
}