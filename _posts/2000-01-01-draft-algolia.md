---
layout: post
title:  "Barre de recherche avec Algolia"
description: "Dans ce tuto nous allons apprendre à construire une barre de recherche avec Algolia."
status: draft
---

Nous supposons qu'il y a une application Ruby on Rails avec un model `Flat` et nous voulons ajouter une barre de recherche avec Algolia.

## Créer son compte sur [Algolia](https://www.algolia.com/users/sign_up)

Ensuite le tuto officiel est [ici](https://www.algolia.com/doc/framework-integration/rails/getting-started/setup/?language=ruby)

### Première étape : Configuration du back-end

On ajoute la Gem

```ruby
# Gemfile
gem "algoliasearch-rails"
```

Et on l'installe

```sh
bundle install
touch config/initializers/algoliasearch.rb
```

```ruby
# config/initializers/algoliasearch.rb
AlgoliaSearch.configuration = {
  application_id: ENV["ALGOLIA_APP_ID"],
  api_key:        ENV["ALGOLIA_API_KEY"]
}
```

```erb
<!-- app/views/layouts/application.html.erb -->
<meta name="algolia-app-id" content="<%= ENV["ALGOLIA_APP_ID"] %>">
<meta name="algolia-search-only-api-key" content="<%= ENV["ALGOLIA_API_KEY"] %>">
```

### Front-end

On installe avec Algolia avec `yarn` et on crée le fichier pour acceuillir le code.

```sh
yarn add places.js
touch app/javascript/plugins/algolia.js
```




### Seconde Étape: On ajoute dans le front la barre de recherche

```erb
<!-- app/index/views/pages/home.html.erb -->
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

### Trosième Étape: On display ou pas les cards que l'on veut.

On va ajouter du code javascript dans les fichiers gérés par Webpack.

```js
// app/javascript/packs/application.js
import { initAlgoliaSearch } from "../plugins/init_algolia_search.js";

initAlgoliaSearch();
````

```js
// app/javascript/plugins/algolia.js
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

Si vous souhaitez faire un

[Exemple de code](https://gist.github.com/Martin-Alexander/95cf3272a4ac7e6905eaecf53f66687d)
