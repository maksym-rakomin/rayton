#!/usr/bin/env python3
"""Render the checked-in Rayton source snapshot into the existing media components.
Run from any directory: python3 tools/render-media.py
The source manifest stores original URLs and publication dates, not sample content.
"""
from pathlib import Path
import json, html, re
ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'assets/data/media.json').read_text())
by_id = {p['id']: p for p in data['articles']}
group = lambda name: [by_id[i] for i in data['groups'][name]]
esc = lambda text: html.escape(str(text), quote=True)
arrow = '<span class="btn__icon"><svg><use href="#i-arrow-ur"></use></svg></span>'
months = ['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня']
def date(p):
 y,m,d = p['date'].split('-')
 return f'{int(d)} {months[int(m)-1]} {y}'
def label(categories):
 for key,title in [('demian','Експертна думка'),('olha','Експертна думка'),('news','Новини'),('hybrid','СЕС + УЗЕ'),('finance','Фінансування'),('storage','УЗЕ'),('solar','СЕС для бізнесу')]:
  if key in categories: return title
 return 'Rayton'
def post(p, hidden=False):
 return f'''<li data-media-category="{esc(' '.join(p['categories']))}"{' hidden' if hidden else ''}>
  <article class="post-card media-post">
    <a class="post-card__media" href="{esc(p['url'])}"><img src="{esc(p['image'])}" alt="{esc(p['title'])}" width="411" height="237" loading="lazy"><span class="tag tag--solid tag--yellow">{label(p['categories'])}</span></a>
    <div class="post-card__body">
      <h3 class="post-card__title"><a href="{esc(p['url'])}" title="{esc(p['title'])}">{esc(p['title'])}</a></h3>
      <p class="post-card__text">{esc(p['excerpt'])}</p>
      <div class="media-post__meta"><div><span>Rayton</span><time datetime="{p['date']}">{date(p)}</time></div><span>≈ {p['minutes']} хв читання</span></div>
      <a class="btn btn--outline media-post__link" href="{esc(p['url'])}">Детальніше {arrow}</a>
    </div>
  </article>
</li>'''
def row(p, video=False):
 title=p['title'];url=p['url'];image=p['thumbnail'] if video else p['image'];note=p['duration'] if video else f"≈ {p['minutes']} хв читання";meta='Rayton Sun' if video else date(p)
 attr=f' data-media-video="{p["id"]}"' if video else ''
 return f'''<a class="media-row" href="{esc(url)}"{attr}>
 <span class="media-row__media"><img src="{esc(image)}" alt="" width="250" height="194" loading="lazy"></span>
 <span class="media-row__body"><span class="media-row__date">{meta}</span><span class="media-row__title">{esc(title)}</span><span class="media-row__note">{note}</span></span></a>'''
def showcase():
 p=group('case')[0];v=data['videos'][0]
 return f'''<section class="section section--dark section-showcase media-tv-showcase" id="projects">
 <div class="container"><ol class="breadcrumbs"><li><a href="index.html">Головна</a></li><li><span>Медіа</span></li><li><span aria-current="page">Rayton TV</span></li></ol>
 <div class="showcase" id="showcase"><div class="showcase__main">
  <div class="section-head"><p class="eyebrow">Реалізовані об’єкти</p><h1 class="section-head__title">Приклади <span class="mark mark--dark">проєктів Rayton</span></h1></div>
  <div class="tabs tabs--light showcase__tabs" data-tabs="#showcase" role="tablist" aria-label="Тип матеріалів"><button class="tabs__btn is-active" type="button" role="tab" aria-selected="true">Статті</button><button class="tabs__btn" type="button" role="tab" aria-selected="false">Відео</button></div>
  <a class="showcase__feature" data-tab-panel="0" href="{esc(p['url'])}"><img src="{p['image']}" alt="Енергонезалежність підприємства Київгума" width="746" height="535" fetchpriority="high"><div class="showcase__feature-body"><h2 class="showcase__feature-title">{esc(p['title'])}</h2><p class="showcase__feature-text">Сонячна генерація та накопичення енергії для стабільної роботи виробництва.</p><p class="showcase__meta">{date(p)}</p></div></a>
  <a class="showcase__feature showcase__feature--video is-hidden" data-tab-panel="1" href="{esc(v['url'])}" data-media-video="{v['id']}"><img src="{esc(v['thumbnail'])}" alt="{esc(v['title'])}" width="746" height="535" loading="lazy"><span class="showcase__play" aria-hidden="true"><svg><use href="#i-play"></use></svg></span><div class="showcase__feature-body"><h2 class="showcase__feature-title">{esc(v['title'])}</h2><p class="showcase__meta">Rayton Sun · {v['duration']}</p></div></a>
 </div><div class="showcase__list" data-tab-panel="0" tabindex="0" aria-label="Статті Rayton">{''.join(row(p) for p in data['articles'][:8])}</div><div class="showcase__list is-hidden" data-tab-panel="1" tabindex="0" aria-label="Відео Rayton">{''.join(row(v,True) for v in data['videos'])}</div></div>
 </div></section>'''
def videos():
 out=[]
 for v in data['videos'][:7]:
  cats=v['categories'];tag='Кейси об’єктів' if 'cases' in cats else 'Огляди обладнання' if 'equipment' in cats else 'Новини'
  out.append(f'''<li data-media-category="{esc(' '.join(cats))}"><a class="post-card" href="{esc(v['url'])}" data-media-video="{v['id']}"><div class="post-card__media"><img src="{esc(v['thumbnail'])}" alt="{esc(v['title'])}" width="416" height="234" loading="lazy"><span class="tag tag--solid tag--yellow">{tag}</span><span class="post-card__time">{v['duration']}</span></div><div class="post-card__body"><h3 class="post-card__title">{esc(v['title'])}</h3><p class="post-card__text">Відео з офіційного каналу Rayton Sun.</p><p class="post-card__meta"><span>Rayton Sun</span><span>Дивитися відео</span></p></div></a></li>''')
 return '\n'.join(out)
def replace(s,name,body):
 pattern=rf'<!-- media:{name}:start -->[\s\S]*?<!-- media:{name}:end -->'
 out,count=re.subn(pattern,lambda m:f'<!-- media:{name}:start -->\n{body}\n<!-- media:{name}:end -->',s)
 if count!=1:raise ValueError(f'Expected one {name} region, found {count}')
 return out
blog=(ROOT/'blog.html').read_text();tv=(ROOT/'youtube.html').read_text()
posts=group('latest')+group('demian')+group('olha')
blog=replace(blog,'posts','\n'.join(post(p,i>=6) for i,p in enumerate(posts)))
for name in ['demian','olha']:blog=replace(blog,name,'\n'.join(post(p) for p in group(name)))
tv=replace(tv,'showcase',showcase());tv=replace(tv,'videos',videos())
related = []
for p in group('latest')[:3]:
    related.append(f'<li><a class="post-card" href="{esc(p["url"])}"><div class="post-card__media"><img src="{esc(p["image"])}" alt="" width="416" height="234" loading="lazy"><span class="tag tag--solid tag--yellow">{label(p["categories"])}</span></div><div class="post-card__body"><h3 class="post-card__title">{esc(p["title"])}</h3></div></a></li>')
tv=replace(tv,'related','\n'.join(related))
for name,text in [('blog.html',blog),('youtube.html',tv)]: (ROOT/name).write_text(text)
print('Rendered 12 original articles, expert selections and 7 original videos.')

# Reuse the existing article page shell and typography for individual local posts.
from html.parser import HTMLParser
from urllib.parse import urlparse
class ArticleHTML(HTMLParser):
    allowed = {'p','h2','h3','h4','ul','ol','li','strong','b','em','i','blockquote','a','br','figure','figcaption','img','table','thead','tbody','tr','th','td','hr'}
    void = {'br','img','hr'}
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.blocked = 0
    def handle_starttag(self, tag, attrs):
        if tag in {'script','style','form'}:
            self.blocked += 1
        if self.blocked or tag not in self.allowed: return
        attrs = dict(attrs)
        safe = ''
        if tag == 'a':
            href = attrs.get('href','')
            parsed = urlparse(href)
            mapping = {p['sourceUrl'].rstrip('/'): p['url'] for p in data['articles']}
            if href.rstrip('/') in mapping: href = '../' + mapping[href.rstrip('/')]
            elif parsed.hostname in {'rayton.com.ua','www.rayton.com.ua'}:
                # Keep links on the new website while its article library grows.
                href = '../blog.html' if '/blogs' in parsed.path else '../contacts.html' if '/contact' in parsed.path else ''
            elif parsed.scheme not in {'https','http','mailto','tel',''}: href = ''
            if href: safe = f' href="{esc(href)}"'
        elif tag == 'img':
            src = attrs.get('data-lazy-src') or attrs.get('src','')
            if urlparse(src).scheme != 'https': return
            safe = f' src="{esc(src)}" alt="{esc(attrs.get("alt",""))}" loading="lazy"'
        self.parts.append(f'<{tag}{safe}>')
    def handle_endtag(self, tag):
        if tag in {'script','style','form'}:
            self.blocked = max(0,self.blocked-1)
            return
        if not self.blocked and tag in self.allowed and tag not in self.void:
            self.parts.append(f'</{tag}>')
    def handle_data(self, text):
        if not self.blocked: self.parts.append(esc(text))

shell = (ROOT/'article.html').read_text()
head = shell[:shell.index('<main>')]
foot = shell[shell.index('</main>')+7:]
# Resolve the shared assets and navigation from the nested articles folder.
def nested(s):
    return re.sub(r'(href|src)="(assets/[^\"]+|[a-z][a-z0-9-]*\.html(?:[^\"]*)?)"',r'\1="../\2"',s)
head, foot = nested(head), nested(foot)
for p in data['articles']:
    parser = ArticleHTML(); parser.feed(p['contentHtml'])
    title = esc(p['title']); cover = '../'+p['image']
    page_head = re.sub(r'<title>.*?</title>',f'<title>{title} — Rayton</title>',head)
    page_head = re.sub(r'<meta name="description" content="[^"]*">',lambda m:f'<meta name="description" content="{esc(p["excerpt"])}">',page_head)
    page_head = page_head.replace('</head>','<link rel="stylesheet" href="../assets/css/media.css?v=2">\n</head>')
    page_head = page_head.replace('page--article','page--article page--media-article')
    main = f'''<main>
<section class="hero hero--sub hero--plain"><div class="container hero__inner">
 <ol class="breadcrumbs"><li><a href="../index.html">Головна</a></li><li><a href="../blog.html">Блог</a></li><li><span aria-current="page">Стаття</span></li></ol>
 <div class="hero__content"><p class="hero__eyebrow"><span class="dot"></span>{label(p['categories'])}</p><h1 class="hero__title">{title}</h1><div class="hero__meta"><span>Rayton</span><time datetime="{p['date']}">{date(p)}</time><span>≈ {p['minutes']} хв читання</span></div><div class="hero__actions"><a class="btn btn--outline" href="../blog.html">Повернутись до блогу {arrow}</a></div></div>
</div></section>
<section class="section"><div class="container"><div class="article"><div class="article__main">
 <div class="article__banner"><img src="{cover}" alt="{title}" width="826" height="460" fetchpriority="high"></div>
 <div class="prose">{''.join(parser.parts)}</div>
 <div class="article__cta"><h2 class="article__cta-title">Енергетичне рішення для вашого бізнесу</h2><p class="article__cta-text">Команда Rayton допоможе підібрати СЕС, УЗЕ або комплексне рішення для вашого об’єкта.</p><a class="btn btn--primary" href="../contacts.html">Отримати консультацію {arrow}</a></div>
</div><aside class="article__aside"><div class="article__cta"><h2 class="article__cta-title">Більше матеріалів Rayton</h2><a class="btn btn--primary" href="../blog.html">Читати блог {arrow}</a><a class="btn btn--outline-light" href="../youtube.html">Дивитися Rayton TV</a></div></aside></div></div></section>
</main>'''
    target=ROOT/p['url']; target.parent.mkdir(exist_ok=True)
    target.write_text(page_head+main+foot)
print(f"Rendered {len(data['articles'])} local article pages using article.html.")
