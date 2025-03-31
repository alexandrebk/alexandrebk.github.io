---
layout: cheat_sheet
title: Cheat Sheet CSS
permalink: /cheat_sheets/css
---

<a href="https://getbootstrap.com/docs/5.0/utilities/text/#font-size" class="underlined" target="_blank">Font size with Bootstrap</a>

```css
.fs-1 { font-size: 42px; }
.fs-2 { font-size: 32px; }
.fs-3 { font-size: 26px; }
.fs-4 { font-size: 20px; }
.fs-5 { font-size: 18px; }
.fs-6 { font-size: 16px; }
```

<a href="https://getbootstrap.com/docs/5.0/utilities/text/#ont-weight-and-italics" class="underlined" target="_blank">Font weight with Bootstrap</a>

```css
.fw-light    { font-weight: 300; }
.fw-normal   { font-weight: 400; }
.fw-medium   { font-weight: 500; }
.fw-semibold { font-weight: 600; }
.fw-bold     { font-weight: 700; }
```

<a href="https://getbootstrap.com/docs/5.0/utilities/spacing/" class="underlined" target="_blank">Padding/Margin</a>

```css
.p-1 .m-1 { 4px; }
.p-2 .m-2 { 8px; }
.p-3 .m-3 { 16px; }
.p-4 .m-4 { 24px; }
.p-5 .m-5 { 48px; }
```

Aligner horizontalement et verticalement un contenu

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

CSS Grid minmax: (<a href="https://www.pinterest.fr/pin/710865122455863798/" class="underlined" target="_blank">démo ici</a>)

```css
.container{
  display: grid;
  grid-template-columns: minmax(14rem, 30%) 1fr;
}
```

Console.log for css

```css
* { box-sizing: border-box !important; outline: 3px solid limegreen !important}
```

<h2>Ressources</h2>

- [Neumorphism](https://neumorphism.io/#e0e0e0)
- [Animista](https://animista.net/play)
- [Animated Background](https://wweb.dev/resources/animated-css-background-generator)
- [Spin Kit](https://tobiasahlin.com/spinkit/)
- [Flexplorer](https://bennettfeely.com/flexplorer/)
- [Grid Generator](https://cssgrid-generator.netlify.app/)
- [Layout Generator](https://layout.bradwoods.io/)
- [Shaddows Brumm](https://shadows.brumm.af/)
- [Glassmorphism](https://hype4.academy/tools/glassmorphism-generator)
- [Cubic-Bezier](https://cubic-bezier.com/#.17,.67,.83,.67)
- [Haikei](https://app.haikei.app/)

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
<br>
<a href="https://www.youtube.com/watch?v=qm0IfG1GyZU&t=126s&ab_channel=GoogleChromeDevelopers"
   class="underlined"
   target="_blank">
  10 modern layouts in 1 line of CSS
</a>
<br>
<a href="https://www.swebdev.fr/blog/la-fonction-css-clamp"
   class="underlined"
   target="_blank">
  La fonction CSS clamp()
</a>
<br>
<a href="https://github.com/atherosai/ui/tree/main/"
   class="underlined"
   target="_blank">
  Exemples de codes
</a>
<br>
<a href="https://keithjgrant.com/posts/2023/04/transitioning-to-height-auto/"
   class="underlined"
   target="_blank">
  Transition from 0 to auto with only CSS
</a>
<br>
<a href="https://web.dev/articles/5-css-snippets-every-front-end-developer-should-know-in-2024"
   class="underlined"
   target="_blank">
  5 extraits CSS que tout développeur front-end devrait connaître en 2024
</a>
<br>
<a href="https://moderncss.dev/12-modern-css-one-line-upgrades/"
   class="underlined"
   target="_blank">
  12 Modern CSS One-Line Upgrades
</a>
<br>
<a href="https://dev.to/tene/css-cheat-sheet-everything-you-need-to-know-in-one-place-157m"
   class="underlined"
   target="_blank">
  CSS Cheat Sheet: Everything You Need to Know in One Place
</a>
