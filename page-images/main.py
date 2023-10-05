import argparse
from pdf2image import convert_from_path
import pathlib
import re


def run():
    argParser = argparse.ArgumentParser()
    argParser.add_argument(
        "-p",
        "--poppler-path",
        help="path to the poppler executable",
        default="pdftocairo",
    )
    argParser.add_argument(
        "-f", "--first-page", help="first page, passed to `pdftocairo`", default=20
    )
    argParser.add_argument(
        "-l", "--last-page", help="last page, passed to `pdftocairo`", default=30
    )
    argParser.add_argument(
        "-i",
        "--input-directory",
        help="directory of book files (input)",
        default="sample-books",
    )
    argParser.add_argument(
        "-o",
        "--output-directory",
        help="directory to store book pages",
        default="elibrary/website/static/images",
    )
    args = argParser.parse_args()

    pdfs = list(pathlib.Path(args.input_directory).glob(f"*.pdf"))

    for pdf in pdfs:
        images = convert_from_path(
            pdf_path=pdf,
            poppler_path=args.poppler_path,
            first_page=args.first_page,
            last_page=args.last_page,
        )
        pdf_idx = re.search("(\d+)", pdf.name).group(0)
        (pathlib.Path(args.output_directory) / pdf_idx).mkdir(
            parents=True, exist_ok=True
        )
        for i, img in enumerate(images):
            j = args.first_page + i
            img.save(f"{args.output_directory}/{pdf_idx}/{j:05d}.jpg", "JPEG")
