"""Create listing thumbnails without modifying original product photographs.

Run with Python and Pillow installed: python scripts/optimize-images.py
"""
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1] / 'images'
output = root / 'optimized'
output.mkdir(exist_ok=True)
for source in root.iterdir():
    if source.suffix.lower() not in ('.png', '.jpg', '.jpeg', '.avif') or source.name == 'logo.png':
        continue
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
        image.save(output / (source.stem + '.webp'), 'WEBP', quality=88, method=6)
print('Optimised images updated; original photographs preserved.')
