import argparse
from pdf2image import convert_from_path
from .. import env
from pathlib import Path


def extract_covers(
    books_dir=env.BOOKS_DIR, covers_dir=env.COVERS_DIR, poppler_path=env.POPPLER_PATH
):
    pdfs = list(Path(books_dir).glob(f"*.pdf"))
    covers_dir = Path(covers_dir)
    covers_dir.mkdir(parents=True, exist_ok=True)

    for pdf in pdfs:
        pdf_idx = pdf.stem
        cover_path = covers_dir / f"{pdf_idx}.jpg"
        if not cover_path.exists():
            print(f"Extracting {cover_path}...")
            try:
                images = convert_from_path(
                    pdf_path=pdf,
                    poppler_path=poppler_path,
                    first_page=1,
                    last_page=1,
                )
                for img in images:
                    img.save(cover_path, "JPEG")
            except:
                print(f"Couldn't extract cover for {pdf}")


def run():
    argParser = argparse.ArgumentParser()
    argParser.add_argument(
        "-p",
        "--poppler-path",
        help="path to the poppler executable",
        default=env.POPPLER_PATH,
    )
    argParser.add_argument(
        "-i",
        "--input-directory",
        help="directory with book files (input)",
        default=env.BOOKS_DIR,
    )
    argParser.add_argument(
        "-o",
        "--output-directory",
        help="directory for covers (output)",
        default=env.COVERS_DIR,
    )
    args = argParser.parse_args()

    extract_covers(
        books_dir=args.input_directory,
        covers_dir=args.output_directory,
        poppler_path=args.poppler_path,
    )
