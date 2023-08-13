---
layout: cheat_sheet
title: Cheat Sheet CSS
permalink: /cheat_sheets/css
---

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

CSS Grid minmax: [démo ici](https://www.pinterest.fr/pin/710865122455863798/)

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
