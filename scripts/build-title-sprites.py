"""Turn the homepage title GIFs into horizontal sprite strips.

GIFs always play from frame 1, so the homepage animates these strips with CSS
instead, which lets each letter start on a random frame.

Each frame is laid side by side in one lossless WebP. Pure-white pixels connected
to the image edge become transparent, so every letter sits on the page
background the way FlashyComputerI.gif already does; white inside the computer
is kept.

Usage (from the repo root):  python3 scripts/build-title-sprites.py
Needs Pillow, numpy and scipy. If the GIFs' frame count or timing changes,
update TITLE_FRAMES / TITLE_FRAME_MS in src/components/TitleLetters.tsx.
"""

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

SRC = Path("public/ComputerGifs")
OUT = Path("public/title")
LETTERS = "RUTOPIA"


def clear_outer_white(frame: Image.Image) -> Image.Image:
    rgba = np.array(frame.convert("RGBA"))
    white = np.all(rgba[..., :3] == 255, axis=-1)
    labels, _ = ndimage.label(white)  # 4-connected, so dithered outlines don't leak inward
    edge = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    outer = np.isin(labels, edge[edge != 0])
    rgba[outer, 3] = 0
    return Image.fromarray(rgba)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for letter in LETTERS:
        gif = Image.open(SRC / f"FlashyComputer{letter}.gif")
        w, h = gif.size
        n = gif.n_frames
        durations = set()
        strip = Image.new("RGBA", (w * n, h), (0, 0, 0, 0))
        for i in range(n):
            gif.seek(i)
            durations.add(gif.info.get("duration"))
            strip.paste(clear_outer_white(gif), (i * w, 0))
        out = OUT / f"{letter}.webp"
        strip.save(out, lossless=True, method=6, exact=False)
        print(f"{out}: {n} frames of {w}x{h}, frame durations {sorted(durations)} ms, {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
