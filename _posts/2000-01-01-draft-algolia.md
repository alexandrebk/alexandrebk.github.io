---
layout: post
title:  "Barre de recherche avec Algolia"
author: alexandre
status: draft
---

Dans ce tuto nous allons apprendre à construire une barre de recherche avec Algolia.

Nous supposons qu'il y a un model `Flat` et qu'il y'a déjà une application Rails avec plusieurs modèles.

Nous allons ajouter une barre de recherche sur la homepage de votre site.

### Première étape

On installe avec Algolia yarn ou npm et on crée le fichier pour acceuillir le code.

```sh
yarn add places.js
touch app/javascript/plugins/autocomplete.js
```

### Seconde Étape: 

```erb
# app/index/views/pages/home.html.erb
<div class="form-group">
  <%= form_tag flats_path, method: :get do %>
  <%= text_field_tag :query,
      params[:query],
      class: "form-control",
      id:"flat_address"
      %>
  <% end %>
</div>
```

### Trosième Étape: 

On va ajouter du code javascript dans les fichiers gérés par Webpack.

```js
# app/javascript/plugin/autocomplete.js
function autocomplete() {
  document.addEventListener("DOMContentLoaded", function() {
    var Poolinput = document.getElementById('pool_address');

    if (Poolinput) {
      var autocomplete = new google.maps.places.Autocomplete(Poolinput, { types: [ 'geocode' ] });
      google.maps.event.addDomListener(Poolinput, 'keydown', function(e) {
        if (e.key === "Enter") {
        //   e.preventDefault(); // Do not submit the form on Enter.
        }
      });
    }
  });
}

export { autocomplete };
```

Et on importe dans `application.js` le fichier `autocomplete.js`
