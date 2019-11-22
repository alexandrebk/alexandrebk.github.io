---
layout: post
title:  "Afficher le prix du renting avec FlatPickr"
author: alexandre
status: draft
---

Dans ce tuto nous allons apprendre comment afficher dynamiquement le prix de la location au moment de la réservation. Cela suppose que vous ayez déjà installé FlatPickr.

## Calcul automatique de Prix


### D'abord on récupère les prix avec GetElementbyId

```js
// app/javascript/plugins/flatpicker.js
// [..]
const startDate = document.getElementById("booking_start_date");
const endDate = document.getElementById("booking_end_date");
```

### Ensuite on fait les calculs

```js
// app/javascript/plugins/flatpicker.js
// [..]
if(endDate) {
  endDate.addEventListener("change", (event) => {
    let dateDiffInMilliseconds = new Date(endDate.value) - new Date(startDate.value) + 86400000;
    let days = dateDiffInMilliseconds / 86400000;
    document.getElementById("days").innerText = `${days} days`
    document.getElementById("price_per_day").innerText = `${(dateDiffInMilliseconds/ 86400000) * 75}€`
  });
}
```

### Ensuite on injecte le prix dans la vue.

