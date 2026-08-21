import sys
from PIL import Image
ref, mine, out, slice_h = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4] if len(sys.argv) > 4 else 760)
a = Image.open(ref).convert('RGB'); b = Image.open(mine).convert('RGB')
H = max(a.height, b.height)
import os; os.makedirs(out, exist_ok=True)
n = 0
for y in range(0, H, slice_h):
    ca = a.crop((0, y, a.width, min(y + slice_h, a.height)))
    cb = b.crop((0, y, b.width, min(y + slice_h, b.height)))
    h = max(ca.height, cb.height)
    canvas = Image.new('RGB', (a.width * 2 + 16, h + 22), (255, 0, 128))
    canvas.paste(ca, (0, 22)); canvas.paste(cb, (a.width + 16, 22))
    canvas = canvas.resize((canvas.width // 2, canvas.height // 2), Image.LANCZOS)
    canvas.save(f'{out}/{n:02d}_y{y}.png'); n += 1
print('slices', n)
