# Create images from book pages

for i in $(seq -f "%06g" 1 10);
do
    FIRST_PAGE=10
    LAST_PAGE=20
    DIR=elibrary/website/static/images/$i
    mkdir -p $DIR
    pdftoppm -f 20 -l 30 -jpeg sample-books/$i.pdf $DIR/page
done

# remove images
# find sample-images/ -iname '*.jpg' -delete