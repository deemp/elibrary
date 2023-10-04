# Create images from book pages

for i in $(seq -f "%06g" 1 10);
do
    FIRST_PAGE=10
    LAST_PAGE=20
    mkdir -p sample-images/$i
    pdftoppm -f 20 -l 30 -jpeg sample-books/$i.pdf sample-images/$i/page
done

# remove images
# find sample-images/ -iname '*.jpg' -delete