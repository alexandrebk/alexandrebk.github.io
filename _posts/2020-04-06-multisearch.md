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

### 0. Setup

Tout d'abord, nous allons créer une application

```sh
rails new multisearch --database postgresql
cd multisearch
rails generate model Flat description:text address:string price_per_night:integer
rails generate model Booking flat:references starts_at:date ends_at:date
rails db:drop db:create db:migrate
rails generate controller Flats index
```

```ruby
# config/routes.rb

Rails.application.routes.draw do
  resources :flats
end
```

```ruby
# db/seeds.rb

puts "Destroying all flats and bookings"
Booking.destroy_all
Flat.destroy_all

abbesse = Flat.create!(
  address: "20 rue des Abbesses, 75018 Paris",
  description: "L'appartement se trouve au cœur du quartier de la butte Montmartre, avec ses ruelles pleines de charme, sa fameuse basilique avec vue imprenable sur la plus belle ville du monde et cette ambiance indescriptible dans une animation permanente qui en fait l'un des endroits les plus typique de notre fabuleuse capitale.",
  price_per_night: 250,
)

gaudelet = Flat.create!(
  address: "16 villa Gaudelet, 75011 Paris",
  description: "Près du centre de Paris en 10 mn en métro ou bus, 20 minutes à pieds pour le Marais. Commerces et Métro Parmentier L3 au pied de l'immeuble. 10 à 20 mn des Gares.",
  price_per_night: 155,
)

universite = Flat.create!(
  address: "176 rue de l'Université, 75007 Paris",
  description: "Votre espace 2 pièces 40m2, tout le 2e étage d'un immeuble de 1830, chambre sur cour, cuisine équipée, table à manger, salon avec poutres apparentes et canapé lit 2 places.",
  price_per_night: 150,
)

mouffetard = Flat.create!(
  address: "30 rue Lhomond, 75005 Paris",
  description: "Appartement entier de 35 m2 situé au 1er étage sur cour dans le 5ème arrondissement de Paris, à côté de la rue Mouffetard, au coeur du quartier latin.",
  price_per_night: 200,
)

puts "#{Flat.count} flats created"

Booking.create!(starts_at: Date.today, ends_at: Date.today + 2, flat: abbesse)
Booking.create!(starts_at: Date.today, ends_at: Date.today + 4, flat: gaudelet)
Booking.create!(starts_at: Date.today, ends_at: Date.today + 7, flat: universite)

puts "#{Booking.count} bookings created"
```

Si ce n'est pas déjà fait, on ajoute la gem <a href="https://github.com/heartcombo/simple_form" target="_blank">simple form</a> pour les formulaires et <a href="https://github.com/Casecommons/pg_search" target="_blank">pg_search</a> pour les recherches dans la base de données PostGreSQL.

```ruby
# Gemfile
[...]

gem 'pg_search'
gem 'simple_form'
```

Puis on installe Simple Form et on lance les seeds.

```sh
bunlde install
rails generate simple_form:install --bootstrap
rails db:seed
```

### <a name="global"></a>1. Recherche globale par mots clés avec pg_search

#### 1.1 On crée un scope dans le modèle

Nous allons commencer par une recherche par mots-clés sur les colonnes `description` et `address` des Flat.

```ruby
# app/models/flat.rb

class Flat < ApplicationRecord
  include PgSearch::Model

  has_many :bookings

  pg_search_scope :search_by_description_and_address,
                  against: [ :description, :address ],
                  using: { tsearch: { prefix: true } }

  [...]
end
```

Pour vérifier que le scope fonctionne, je teste en console.

```ruby
# rails console

flats = Flat.search_by_description_and_address('Gaudelet')
flats.count # => 1
```

Je récupère bien un `Flat` qui comprend `Gaudelet` dans son adresse.
<img src="/images/posts/multisearch/pg_search_console.png"
     class="image"
     alt="pg search console">

#### 1.2 On ajoute le formulaire dans la vue

Dans l'index, on va ajouter un formulaire puis on affiche les appartements.

```erb
<!-- app/views/flats/index.html.erb -->

<h1>Tous les appartements</h1>
<%= simple_form_for :flats, method: :get,
                            defaults: { required: false } do |f| %>
  <%= f.input :search, label: "Recherche par adresse ou description",
                       input_html: { name: 'search',
                                     value: params.dig(:search) } %>
  <%= f.submit "Chercher", class: "btn btn-primary" %>
<% end %>

<ul>
  <% @flats.each do |flat| %>
    <li> <%= flat.address %> | <%= flat.price_per_night %> € | <%= flat.description %> </li>
  <% end %>
</ul>
```

#### 1.3 On filtre les données dans le controller

Si le params `search` est présent, on applique le scope `search_by_description_and_address` sur le model `Flat`.

```ruby
# app/controllers/flats_controller.rb

class FlatsController < ApplicationController
  def index
    if params[:search].present?
      @flats = Flat.search_by_description_and_address(params[:search])
    else
      @flats = Flat.all
    end
  end
end
```

<img src="/images/posts/multisearch/recherche_globale.gif"
     class="image"
     alt="gif recherche globale">

<br>
<br>

### <a name="price"></a>2. Recherche par prix

#### 2.1 On ajoute les champs de prix dans le formulaire

```erb
<!-- app/views/flats/index.html.erb -->

<%= simple_form_for :flats, method: :get,
                            defaults: { required: false } do |f| %>
  [...]
  <%= f.input :min_price, label: "Prix min",
                          required: false,
                          input_html: { type: :number,
                                        name: :min_price,
                                        value: params.dig(:min_price)} %>
  <%= f.input :max_price, label: "Prix max",
                          required: false,
                          input_html: { type: :number,
                                        name: :max_price,
                                        value: params.dig(:max_price) } %>
  [...]
<% end %>
```

<img src="/images/posts/multisearch/champs_prix.png" class="image" alt="affichage champs prix">

#### 2.2 On ajoute les filtres dans `FlatsController`

```ruby
# app/controllers/flats_controller.rb

class FlatsController
  def index
    if params[:search].present?
      @flats = Flat.search_by_description_and_address(params[:search])
    else
      @flats = Flat.all
    end
    if params[:min_price].present?
      @flats = @flats.where("price_per_night >= ?", params[:min_price])
    end
    if params[:max_price].present?
      @flats = @flats.where("price_per_night <= ?", params[:max_price])
    end
  end
end
```

<img src="/images/posts/multisearch/filtre_prix.gif" class="image" alt="gif filtre prix">

<br>
<br>

### <a name="dates"></a>3. Recherche par dates

#### 3.1 On ajoute les champs de date d'arrivée et de date de départ dans le formulaire.

```erb
<!-- app/views/flats/index.html.erb -->

<%= simple_form_for :flats, method: :get,
                            defaults: { required: false } do |f| %>
  [...]
  <%= f.input :starts_at, label: "Début le",
                          input_html: { type: :date,
                                        name: :starts_at,
                                        value: params.dig(:starts_at) } %>
  <%= f.input :ends_at, label: "Fin le",
                        input_html: { type: :date,
                                      name: :ends_at,
                                      value: params.dig(:ends_at) } %>
  [...]
<% end %>
```

<img src="/images/posts/multisearch/champs_dates.png"
     class="image"
     alt="affichage champs date">

<br>
<br>

#### 3.2 On vérifie la disponibilité des appartements

On définie une méthode d'instance `Flat#is_available?` avec deux paramètres, la date d'entrée et la date de sortie.

Dans cette méthode, on compare les dates recherchées et les dates de réservation. Pour cela on va utiliser `overlaps?` (cf. [documentation](https://apidock.com/rails/Range/overlaps%3F)).

```ruby
#app/models/flat.rb

class Flat < ApplicationRecord
  [...]

  def is_available?(start_date, end_date)
    bookings.each do |b|
      return false if (b.starts_at..b.ends_at).overlaps?(start_date.to_date..end_date.to_date)
    end
    true
  end
end
```

#### 3.3 On affiche les appartements disponibles.

Avec la méthode `select`, je sélectionne les appartements disponibles.

```ruby
#app/controllers/flat_controller.rb
class FlatsController
  def index
   if params[:search].present?
      @flats = Flat.search_by_description_and_address(params[:search])
    else
      @flats = Flat.all
    end
    if params[:min_price].present?
      @flats = @flats.where("price_per_night >= ?", params[:min_price])
    end
    if params[:max_price].present?
      @flats = @flats.where("price_per_night <= ?", params[:max_price])
    end
    if params[:starts_at].present? && params[:ends_at].present?
      @flats = @flats.select do |flat|
        flat.is_available?(params[:starts_at], params[:ends_at])
      end
    end
  end
end
```

<img src="/images/posts/multisearch/filtre_dates.gif"
     class="image"
     alt="gif filtre date">

<br>
<br>

Vous avez maintenant les cartes en main pour réaliser un formulaire de recherche complet.
