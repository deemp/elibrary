import argparse
from pdf2image import convert_from_path
import pathlib
from .. import env


def extract_covers(
    books_dir=env.BOOKS_DIR, covers_dir=env.COVERS_DIR, poppler_path=env.POPPLER_PATH
):
    pdfs = list(pathlib.Path(books_dir).glob(f"*.pdf"))

    for pdf in pdfs:
        images = convert_from_path(
            pdf_path=pdf,
            poppler_path=poppler_path,
            first_page=1,
            last_page=1,
        )
        pdf_idx = pdf.stem
        pathlib.Path(covers_dir).mkdir(parents=True, exist_ok=True)
        for img in images:
            img.save(f"{covers_dir}/{pdf_idx}.jpg", "JPEG")


def run():
    argParser = argparse.ArgumentParser()
    argParser.add_argument(
        "-p",
        "--poppler-path",
        help="path to the poppler executable",
    )
    argParser.add_argument(
        "-i",
        "--input-directory",
        help="directory with book files (input)",
    )
    argParser.add_argument(
        "-o",
        "--output-directory",
        help="directory for covers (output)",
    )
    args = argParser.parse_args()

    extract_covers(
        books_dir=args.input_directory,
        covers_dir=args.output_directory,
        poppler_path=args.poppler_path,
    )
