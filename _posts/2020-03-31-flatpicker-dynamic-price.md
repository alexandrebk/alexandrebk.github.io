---
layout: post
title:  "Flatpicker: afficher dynamiquement le prix total"
description: "Dans ce tuto nous allons apprendre à afficher de façon dynamique un élement en fonction d'un autre élement variable"
status: tech
tags: "flatpickr, datepickr, javascript"
---

Cet article fait suite à l'article [sur l'installation de flatpickr](/2019/07/24/flatpicker-in-rails.html).

Dans ce tutoriel, nous allons apprendre à afficher un prix de façon dynamique avec du JavaScript. Nous allons prendre comme exemple le prix total pour une réservation d'appartement, qui sera fonction du nombre de nuits et du prix par nuit. L'objectif est que le prix total se mette à jour automatiquement comme ci-dessous.

<img src="/images/posts/dynamic-JS/prix_dynamique.gif" class="image" alt="GIF prix dynamique">

## 1. On crée des IDs que l'on place dans la vue

Dans la `show` d'un `flat`, nous souhaitons afficher à l'utilisateur deux choses, le nombre total de nuits et le prix total. D'abord, on va avoir besoin d'une `div` avec un `id` 'total-nights' et ensuite une autre `div` avec un `id` 'total-price'.

```erb
<!-- app/views/flats/show.html.erb -->

<div class="container">
  <div class="form-wrapper">
    <h2>Book a flat</h2>
    <!-- Formulaire -->
    <p>Réservation pour <span id="total-nights">0</span> nuits</p>
    <p>Prix total : <span id="total-price">0</span> € </p>
  </div>
</div>
```

## 2. On récupère les dates avec Javascript

Ici, on se place dans le fichier `app/javascript/plugins/flatpicker.js` parce que Flatpickr est déjà installé ([voir le précédent article sur le sujet](/2019/07/24/flatpicker-in-rails.html))

Dans un autre contexte, vous pouvez créer un fichier `app/javascript/plugins/dynamicPrice.js` sans oublier de l'importer dans `app/javascript/packs/application.js`.

```js
// app/javascript/plugins/flatpicker.js

// [...]
const startDate = document.getElementById("range_start");
const endDate = document.getElementById("range_end");
```

Et on teste en console qu'on récupère les bonnes données du formulaire de réservation.

<img src="/images/posts/dynamic-JS/console_log_dates.png" class="image" alt="affichage dates en console">

## 3. On calcule le nombre de nuits à chaque changement de date

```js
// app/javascript/plugins/flatpicker.js

// [...]

const dynamicPrice = () => {
  let dateDiffInMilliseconds = new Date(endDate.value) - new Date(startDate.value);
  let nbrOfNights = dateDiffInMilliseconds / 86400000;
};

dynamicPrice();
```

On veut mettre à jour le nombre de nuits quand une des dates du formulaire est modifiée par l'utilisateur. Pour cela, on appelle notre fonction de calcul si une des dates change.

```js
// app/javascript/plugins/flatpicker.js

// [...]
[startDate, endDate].forEach(date => {
  date.addEventListener("change", (event) => {
    dynamicPrice();
  });
})
```

## 4. Enfin on injecte le nombre de nuits dans la vue.

```js
// app/javascript/plugins/flatpicker.js

// [...]
const totalNights = document.getElementById("total-nights")

// [...]

const dynamicPriceCalculator = () => {
  // [...]
  // je n'affiche le nombre de nuit que si les deux dates sont sélectionnées
  if(startDate.value && endDate.value) {
    totalNights.innerText = nbrOfNights
  }
};
```

On obtient ce résultat :

<img src="/images/posts/dynamic-JS/affichage_nbr_nuits.gif" class="image" alt="affichage nombre de nuit">

Maintenant, nous allons faire la même chose pour afficher le prix total.

## 5. On récupère le prix de l'appartement grâce à un ID

Toujours dans la `show` d'un `flat`, on ajoute un `span` avec l' `id`'flat-price-per-night' pour pouvoir récupérer le prix par nuit.

```erb
<!-- app/views/flats/show.html.erb -->

<p>
  <i class="fas fa-euro-sign"></i>
  <span id="flat-price-per-night"><%= @flat.price %></span> € / nuit
</p>
```

```js
// app/javascript/plugins/flatpicker.js

// [...]
const flatPricePerNight = document.getElementById("flat-price-per-night").innerText;
const totalPriceElement = document.getElementById("total-price");
```

Je peux ajouter `console.log(flat-price-per-night)` dans la console de mon navigateur pour vérifier qu'on a récupéré la bonne valeur.

<img src="/images/posts/dynamic-JS/affichage_prix_sublime.png" class="image" alt="affichage prix dans sublime text">
<img src="/images/posts/dynamic-JS/affichage_prix_console.png" class="image" alt="affichage prix dans console">

## 6. On calcule le prix total et on l'injecte dans la vue.

```js
// app/javascript/plugins/flatpicker.js

// [...]

if(startDate.value && endDate.value) {
  // [...]
  totalPriceElement.innerText = nbrOfNights * flatPricePerNight
}
```

Voila, le prix total est affiché dans la vue, l'objectif est atteint!

<img src="/images/posts/dynamic-JS/prix_dynamique.gif" class="image" alt="GIF prix dynamique">
