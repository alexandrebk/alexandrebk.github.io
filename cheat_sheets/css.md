---
layout: cheat_sheet
title: Cheat Sheet CSS
permalink: /cheat_sheets/css
---


Aligner horizontalement et verticalement un contenu avec bootstrap

```html
<div class="d-flex justify-content-center align-items-center"></div>
```

La même chose en pure css

```css
.flex-center {
  display:         flex;
  align-items:     center;
  justify-content: center;
}
```

Grille avec 3 colonnes

```css
.grid-3x1fr {
  display:  grid;
  grid-gap: 16px;
  grid-template-columns: 1fr 1fr 1fr;
}
```
