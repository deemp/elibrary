from paddleocr import PaddleOCR
import json
from pathlib import Path


def ocr_json(do_ocr=False):
    if not do_ocr:
        pass

    ocr = PaddleOCR(
        use_angle_cls=True, lang="en", det_lang="ml"
    )  # need to run only once to download and load model into memory
    images_dir = Path("elibrary/website/static/images")
    json_dir = Path("elibrary/website/static/json")

    for image_subdir in sorted([f for f in images_dir.iterdir() if f.is_dir()]):
        json_subdir = json_dir / image_subdir.name
        json_subdir.mkdir(parents=True, exist_ok=True)
        for image in sorted([f for f in image_subdir.iterdir() if f.is_file()]):
            print(f"\n*****\n{image}\n*****\n")
            json_file = f"{json_subdir}/{image.stem}.json"
            print(json_file)
            result = ocr.ocr(str(image), cls=True)
            with open(json_file, mode="w") as f:
                json.dump(result, fp=f)

def run():
    ocr_json(do_ocr=False)


if __name__ == "__main__":
    run(do_ocr=False)
