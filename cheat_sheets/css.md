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

<h2>Des articles pour aller plus loin</h2>

<a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/"
   class="underlined"
   target="_blank">
  CSS Tricks
</a>
<br>
<a href="https://medium.com/@Cesscode/list-of-useful-websites-every-web-developer-should-know-about-c8561b862e5f"
   class="underlined"
   target="_blank">
  Une liste de sites utiles pour faire du css ou du design
</a>
<br>
<a href="https://dev.to/smpnjn/everything-youll-ever-need-to-know-about-html-input-types-38lb"
   class="underlined"
   target="_blank">
  Panorama des input en html
</a>
