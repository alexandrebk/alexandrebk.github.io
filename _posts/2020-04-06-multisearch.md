---
layout: post
title:  "Ajouter un formulaire de recherche multi-critères"
description: "Dans ce tuto nous allons ajouter un formulaire de recherche selon plusieurs critères."
status: tech
tags: "search"
---

Sur n'importe quel site web, nous avons souvent besoin de faire des recherches sur les ressources du site. Dans cet article, nous allons mettre en place une barre de recherche qui va nous permettre d'afficher des appartements qui peuvent nous intéresser.

Nous allons voir plusieurs types de recherches :

1. [Recherche globale par mots clés (pg_search)](#global)
2. [Recherche par prix](#price)
3. [Recherche par dates](#dates)

<br>
<br>

### <a name="global"></a>1. Recherche globale par mots clés avec pg_search

#### 1.1 On ajoute la gem pg_search

Tout d'abord, on ajoute la `gem pg_search`.
Vous trouverez la doc de la `gem` <a href="https://github.com/Casecommons/pg_search" target="_blank">ici</a>.

```ruby
# Gemfile

gem 'pg_search'
```

Puis on lance l'installation grâce à `bundle install`

```shell
$ bundle install
```

#### 1.2 On crée un scope dans le modèle

Nous allons commencer par une recherche par mots-clés sur les colonnes `description` et `address` des Flat.

```ruby
# app/models/flat.rb

class Flat < ApplicationRecord
  include PgSearch::Model

  pg_search_scope :search_by_description_and_address,
    against: [ :description, :address ],
    using: {
      tsearch: { prefix: true }
    }

  [...]
end
```

Pour vérifier que le scope fonctionne, je teste en console.

```ruby
# rails c

Flat.search_by_description_and_address('Gaudelet')
```

Dans mon cas, je récupère bien un `Flat` qui possède le mot `Gaudelet` dans son adresse.
<img src="/images/posts/multisearch/pg_search_console.png" class="image" alt="pg search console">

#### 1.3 On ajoute le formulaire dans la vue

Dans l'index des appartements, on ajoute un formulaire que l'on nommera ici `flats_filter`.

Il contient un `input :search`

```erb
<!-- app/views/flats/index.html.erb -->

<div class="search">
  <%= simple_form_for :flats_filter, url: flats_path, method: :get do |f| %>
    <%= f.input :search, label: false, value: params.dig(:flats_filter, :search) %>
    <%= f.submit "Chercher", class: "btn btn-primary" %>
  <% end %>
</div>

```

#### 1.4 On filtre les données dans le controller

Dans le controller on filtre les données en fonction de la recherche utilisateur.

Si les params sont présents, on applique le scope sur le model `Flat` pour récupérer les appartements concernés par la recherche.

```ruby
# app/controllers/flat_controller.rb

@flats = Flat.where.not(latitude: nil, longitude: nil)

flats_filter = params[:flats_filter]

if flats_filter.present?
  if flats_filter[:search].present?
    @flats = Flat.search_by_description_and_address(flats_filter[:search])
  end
end
```

<img src="/images/posts/multisearch/recherche_globale.gif" class="image" alt="gif recherche globale">

<br>
<br>

### <a name="price"></a>2. Recherche par prix

#### 2.1 On ajoute les champs de prix dans le formulaire

```erb
<!-- app/views/flats/index.html.erb -->

<%= simple_form_for :flats_filter, url: flats_path, method: :get do |f| %>
[...]
  <%= f.input :min_price, label: false,
                          input_html: { type: :number,
                                        min: "0",
                                        value: params.dig(:flats_filter, :min_price),
                                        placeholder: "Prix mini" } %>
  <%= f.input :max_price, label: false,
                          input_html: { type: :number,
                                        value: params.dig(:flats_filter, :max_price),
                                        placeholder: "Prix max" } %>
  <%= f.submit "Chercher", class: "btn btn-primary" %>
<% end %>
```

<img src="/images/posts/multisearch/champs_prix.png" class="image" alt="affichage champs prix">

#### 2.2 On filtre dans le controller

```ruby
# app/controllers/flat_controller.rb

if flats_filter.present?
  [...]
  if flats_filter[:min_price].present?
    @flats = @flats.where("flats.price >= ?", flats_filter[:min_price])
  end
  if flats_filter[:max_price].present?
    @flats = @flats.where("flats.price <= ?", flats_filter[:max_price])
  end
end
```

<img src="/images/posts/multisearch/filtre_prix.gif" class="image" alt="gif filtre prix">

<br>
<br>

### <a name="dates"></a>3. Recherche par date

#### 3.1 On ajoute les champs de date d'arrivée et de date de départ dans le formulaire.

```erb
<!-- app/views/flats/index.html.erb -->

<%= simple_form_for :flats_filter, url: flats_path, method: :get do |f| %>
  [...]
  <%= f.input :start_date, label: false,
                                  input_html: { type: :date,
                                                value: params.dig(:flats_filter, :start_date) } %>
  <%= f.input :end_date, label: false,
                                input_html: { type: :date,
                                              value: params.dig(:flats_filter, :end_date) } %>
  <%= f.submit "Chercher", class: "btn btn-primary" %>
<% end %>
```

<img src="/images/posts/multisearch/champs_dates.png" class="image" alt="affichage champs date">

<br>
<br>

#### 3.2 On vérifie la disponibilité des appartements

On définie une méthode d'instance `is_available?` avec deux arguments (la date d'entrée et la date de sortie) dans le modèle `Flat.rb`.

Dans cette méthode on compare les dates recherchées avec les dates de réservation. Pour cela on utilise `overlaps?` (cf. [documentation](https://apidock.com/rails/Range/overlaps%3F)).

```ruby
#app/models/flat.rb

class Flat < ApplicationRecord
  [...]

  def is_available?(start_date, end_date)
    bookings.each do |b|
      return false if (b.start_date..b.end_date).overlaps?(start_date.to_date..end_date.to_date)
    end
    return true
  end
end
```

#### 3.3 On affiche les appartements disponibles.

Grâce à la méthode `select` je sélectionne les appartements disponibles (c'est-à-dire qui retourne `true` à `is_available?`).

```ruby
#app/controllers/flat_controller.rb

def index
  [...]
  if flats_filter[:start_date].present? || flats_filter[:end_date].present?
    @flats = @flats.select { |flat| flat.is_available?(flats_filter[:start_date],flats_filter[:end_date]) }
  end
end
```

<img src="/images/posts/multisearch/filtre_dates.gif" class="image" alt="gif filtre date">

<br>
<br>

Vous avez maintenant les cartes en main pour réaliser un formulaire de recherche complet.
