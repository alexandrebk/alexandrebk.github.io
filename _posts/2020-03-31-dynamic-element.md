---
layout: post
title:  "Afficher un élement de façon dynamique (exemple du prix)"
description: "Dans ce tuto nous allons apprendre à afficher de façon dynamique un élement en fonction d'un autre élement variable"
status: tech
tags: "flatpickr, datepickr, javascript"
---

Cet article fait suite à l'article [sur l'ajout de flatpickr](/2019/07/24/flatpicker-in-rails.html).


Dans ce tuto nous allons apprendre à afficher un élement de façon dynamique grâce à Javascript.
Nous allons prendre l'exemple du prix total pour une réservation d'appartement en fonction du nombre de nuits.
Nous voulons que le prix total se mette à jour automatiquement.

L'objectif est le suivant :
<img src="/images/posts/dynamic-JS/prix_dynamique.gif" class="image" alt="GIF prix dynamique">


### 1. On crée des IDs que l'on place dans la vue

Nous allons avoir besoin d'un `id="total-nights"` pour afficher le nombre de nuit et d'un `id="total-price"` pour afficher le prix total. Ils vont nous permettre de récupérer les éléments avec Javascript


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


### 2. On récupère les dates avec Javascript

Ici je me place dans le fichier `app/javascript/plugins/flatpicker.js` parce que j'ai déjà mis en place Flatpickr.

Dans un autre contexte, vous pouvez créer un fichier `app/javascript/plugins/dynamicPrice.js` sans oublier de l'importer dans `app/javascript/packs/application.js`.


```js
// app/javascript/plugins/flatpicker.js

// [...]
const startDate = document.getElementById("range_start");
const endDate = document.getElementById("range_end");

```

Je teste en console que je récupère les bonnes données.

<img src="/images/posts/dynamic-JS/console_log_dates.png" class="image" alt="affichage dates en console">

### 3. On calcule le nombre de nuits à chaque changement de date

```js
// app/javascript/plugins/flatpicker.js

// [...]

const dynamicPrice = () => {
  let dateDiffInMilliseconds = new Date(endDate.value) - new Date(startDate.value);
  let nbrOfNights = dateDiffInMilliseconds / 86400000;
};

dynamicPrice();
```

Je veux que le nombre de nuits se mette à jour à chaque fois qu'une des dates est modifiée par l'utilisateur. Pour cela j'écoute les dates et j'appelle la fonction si l'une d'elles change.

```js
// app/javascript/plugins/flatpicker.js

// [...]
[startDate, endDate].forEach(date => {
  date.addEventListener("change", (event) => {
    dynamicPrice();
  });
})
```

### 4. Enfin on injecte le nombre de nuits dans la vue.


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

Je dois obtenir ce résultat :

<img src="/images/posts/dynamic-JS/affichage_nbr_nuits.gif" class="image" alt="affichage nombre de nuit">

Maintenant que nous récupérons et affichons le nombre de nuits, nous allons faire la même chose pour afficher le prix en fonction du nombre de nuits.

### 5. On récupère le prix de l'appartement grâce à un ID

Dans la vue d'un appartement je place un span avec l' `id="flat-price-per-night"` pour en récupérer la valeur dans le fichier JS.


```erb
<!-- app/views/flats/show.html.erb -->

<p>
  <i class="fas fa-euro-sign"></i>
  <span id="flat-price-per-night"><%= @flat.price %></span> € / nuit
</p>
```

On récupère le prix ainsi que l'emplacement du futur prix total

```js
// app/javascript/plugins/flatpicker.js

// [...]
const flatPricePerNight = document.getElementById("flat-price-per-night").innerText;
const totalPriceElement = document.getElementById("total-price");
```

Je peux ajouter `console.log(flat-price-per-night)` pour vérifier que je récupère la bonne valeur.


<img src="/images/posts/dynamic-JS/affichage_prix_sublime.png" class="image" alt="affichage prix dans sublime text">
<img src="/images/posts/dynamic-JS/affichage_prix_console.png" class="image" alt="affichage prix dans console">


### 6. On calcule le prix total et on l'injecte dans la vue.


```js
// app/javascript/plugins/flatpicker.js

// [...]

if(startDate.value && endDate.value) {
    [...]
    totalPriceElement.innerText = nbrOfNights * flatPricePerNight
  }

```

Maintenant que le prix total est injecté dans la vue, vous devez avoir atteint l'objectif !

<img src="/images/posts/dynamic-JS/prix_dynamique.gif" class="image" alt="GIF prix dynamique">
