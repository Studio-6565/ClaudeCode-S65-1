import sys, os
from PIL import Image, ImageDraw, ImageFont
files = sorted(os.listdir('out/posters'))
files = [f for f in files if f.endswith(('.jpg','.png')) and f.startswith(tuple(sys.argv[4].split(',')))]
cols = 4; w, h = 480, 270; pad = 14; lab = 30
sel = files[int(sys.argv[1]):int(sys.argv[2])]
rows = (len(sel)+cols-1)//cols
sheet = Image.new('RGB', (cols*(w+pad)+pad, rows*(h+lab+pad)+pad), (30,30,30))
d = ImageDraw.Draw(sheet)
for i, f in enumerate(sel):
    im = Image.open('out/posters/'+f).convert('RGBA').resize((w, h))
    bg = Image.new('RGBA', (w, h), (90, 110, 130, 255)); bg.alpha_composite(im); im = bg.convert('RGB')
    x = pad + (i%cols)*(w+pad); y = pad + (i//cols)*(h+lab+pad)
    sheet.paste(im, (x, y+lab)); d.text((x, y+8), f[:-4], fill=(230,230,230))
sheet.save(sys.argv[3], quality=88)
