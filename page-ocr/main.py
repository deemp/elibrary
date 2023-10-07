from paddleocr import PaddleOCR
import json
from pathlib import Path
from lxml import etree


def all_image_to_json(images_dir, json_dir, do_ocr=False):
    if not do_ocr:
        return

    ocr = PaddleOCR(
        use_angle_cls=True, lang="en", det_lang="ml"
    )  # need to run only once to download and load model into memory

    for image_subdir in sorted([f for f in images_dir.iterdir() if f.is_dir()]):
        json_subdir = json_dir / image_subdir.name
        json_subdir.mkdir(parents=True, exist_ok=True)
        for image_file_path in sorted(
            [f for f in image_subdir.iterdir() if f.is_file()]
        ):
            print(f"\n*****\n{image_file_path}\n*****\n")
            json_file_path = f"{json_subdir}/{image_file_path.stem}.json"
            print(json_file_path)
            result = ocr.ocr(str(image_file_path), cls=True)
            with open(json_file_path, mode="w") as f:
                json.dump(result, fp=f)


def json_to_xml(json_file_path, xml_file_path):
    """
    djvuxml and paddleocr coordinate systems coincide
    x-axis goes from left to right
    y-axis goes from top to bottom

    As for bounding boxes

    djvuxml uses coordinates A, B:
    - A - left bottom
    - B - right top

    paddleocr gives coordinates A,B,C,D:
    - A - left top
    - B - right top
    - C - right bottom
    - D - left bottom

    So, to convert from paddleocr to djvuxml,
    I take the coordinates D, B from paddleocr
    """

    ocr_json = None
    with open(json_file_path, "r") as j:
        ocr_json = json.loads(j.read())

    # bookreader doesn't use some attributes from responses (https://gitlab.pg.innopolis.university/elibrary/elibrary/-/issues/9)
    # for now, the attributes like page height and DPI can be derived from source images
    # however, later, they should be included into xml

    root = etree.Element(
        "OBJECT",
    )
    hidden_text = etree.SubElement(root, "HIDDENTEXT")
    page_column = etree.SubElement(hidden_text, "PAGECOLUMN")
    region = etree.SubElement(page_column, "REGION")
    paragraph = etree.SubElement(region, "PARAGRAPH")

    if not ocr_json[0]:
        return
    for line in ocr_json[0]:
        [_, [bx, by], _, [dx, dy]] = line[0]
        [line_text, _] = line[1]

        line_node = etree.SubElement(paragraph, "LINE")
        word = etree.SubElement(
            line_node,
            "WORD",
            attrib={
                "coords": f"{round(dx)},{round(dy)},{round(bx)},{round(by)}",
            },
        )
        word.text = line_text

    print(f"\n*****\n{json_file_path}\n*****\n")
    print(xml_file_path)

    with open(xml_file_path, "w") as x:
        x.write(
            etree.tostring(
                root,
                pretty_print=True,
                xml_declaration=True,
                encoding="UTF-8",
            ).decode()
        )


def all_json_to_xml(json_dir, xml_dir):
    for json_subdir in sorted([f for f in json_dir.iterdir() if f.is_dir()]):
        xml_subdir = xml_dir / json_subdir.name
        xml_subdir.mkdir(parents=True, exist_ok=True)
        for json_file_path in sorted([f for f in json_subdir.iterdir() if f.is_file()]):
            xml_file_path = f"{xml_subdir}/{json_file_path.stem}.xml"
            json_to_xml(json_file_path=json_file_path, xml_file_path=xml_file_path)


def run():
    prefix = Path("elibrary/website/static")

    images_dir = prefix / "images"
    json_dir = prefix / "json"
    all_image_to_json(images_dir=images_dir, json_dir=json_dir)

    xml_dir = prefix / "xml"
    all_json_to_xml(json_dir=json_dir, xml_dir=xml_dir)


if __name__ == "__main__":
    run(do_ocr=False)
