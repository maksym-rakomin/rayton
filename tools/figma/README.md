# Разбор .fig-файла

Скрипты, которыми макет `Rayton – new website.fig` был разобран в данные:
декодер бинарного формата Figma (kiwi + zstd), резолвер компонентов,
экспорт геометрии, иконок и справочный рендер макета.

Нужны, если макет обновится и вёрстку надо будет сверить заново.

```bash
# 1. распаковать .fig (это zip)
unzip -o "Rayton – new website.fig" -d fig/

# 2. декодировать canvas.fig -> schema.json + doc.json
node kiwi.js fig/canvas.fig schema.json doc.json

# 3. выгрузить страницу в плоскую модель (GUID фрейма или его имя)
OUT=page_home.json node expand.js "276:12512"    # Головна
OUT=page_ses.json  node expand.js "352:10597"    # СЕС
OUT=page_uze.json  node expand.js "456:14852"    # УЗЕ

# 4. справочный рендер макета в HTML (для попиксельной сверки)
node render.js page_home.json ref/home.html      # ждёт fig/images рядом как ./images

# 5. спецификация секции: геометрия, автолэйаут, заливки, типографика
node spec.js page_home.json "Про компанію" 5

# 6. иконки в SVG
node icons.js page_home.json page_ses.json page_uze.json   # -> icons_out/
node pick.js manifest.json                                  # точечный отбор -> picked/
```

Ключевые находки по формату (Figma file version 106):

- `.fig` — это zip: `canvas.fig` (данные), `images/*` (без расширений, имя = sha1), `meta.json`;
- `canvas.fig` = `"fig-kiwi"` + uint32 версия + чанки `[uint32 длина][данные]`;
  первый чанк — kiwi-схема (deflate), второй — сообщение (**zstd**, не deflate);
- `guidPath` в оверрайдах инстанса — это цепочка **вложенных инстансов** плюс сам узел,
  а не полный путь предков; корневой оверрайд адресуется guid'ом самого символа;
- геометрия векторов лежит в `fillGeometry[].commandsBlob` — байтовый поток команд
  `0=Z, 1=M(2), 2=L(2), 3=Q(4), 4=C(6)` с float32 LE;
- у узлов есть локальная матрица (поворот!), поэтому позиции нужно считать
  композицией матриц, а не суммой смещений.
