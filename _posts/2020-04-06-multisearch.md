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
3. [Recherche par catégories](#category)
4. [Recherche par dates](#dates)

<br>
<br>

### 0. Setup

Tout d'abord, nous allons créer une application avec deux modèles *Flat* et *Booking*.

```sh
rails new multisearch --database postgresql && cd multisearch
rails generate model Flat address category description:text price_per_night:integer
rails generate model Booking flat:references starts_at:date ends_at:date
rails generate controller Flats index
```

```ruby
# app/models/flat.rb

class Flat < ApplicationRecord
  AUTHORIZED_CATEGORIES = ["farm", "mansion", "castle"]
  validates :category, inclusion: { in: AUTHORIZED_CATEGORIES }
end
```

Ensuite nous allons configurer les routes et ajouter des seeds.

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
  address: "20 rue Mouffetard, 75005 Paris",
  category: "farm",
  description: "Une ferme des plus atypique au centre de notre fabuleuse capitale.",
  price_per_night: 250,
)

gaudelet = Flat.create!(
  address: "16 villa Gaudelet, 75011 Paris",
  category: "mansion",
  description: "Près du centre de Paris en 10 mn en métro ou bus, 20 minutes à pieds pour le Marais. Commerces et Métro Parmentier L3 au pied de l'immeuble. 10 à 20 mn des Gares.",
  price_per_night: 155,
)

universite = Flat.create!(
  address: "176 rue de l'Université, 75007 Paris",
  category: "castle",
  description: "Un château de 2 étages avec 2 pièces de 40m2, datant de 1830, avec cour intérieur, cuisine équipée, table à manger, salon avec poutres apparentes et canapé lit 2 places.",
  price_per_night: 150,
)

mouffetard = Flat.create!(
  address: "30 rue Lhomond, 75005 Paris",
  category: "castle",
  description: "Château en plein Paris à côté de la rue Mouffetard, au coeur du quartier latin.",
  price_per_night: 200,
)

puts "#{Flat.count} flats created"

Booking.create!(starts_at: Date.today, ends_at: Date.today + 2, flat: abbesse)
Booking.create!(starts_at: Date.today, ends_at: Date.today + 4, flat: gaudelet)
Booking.create!(starts_at: Date.today, ends_at: Date.today + 7, flat: universite)

puts "#{Booking.count} bookings created"

```

Si ce n'est pas déjà fait, on ajoute la gem <a href="https://github.com/heartcombo/simple_form" class="underlined" target="_blank">simple form</a> pour les formulaires et <a href="https://github.com/Casecommons/pg_search" class="underlined" target="_blank">pg_search</a> pour les recherches dans la base de données PostGreSQL.

```ruby
# Gemfile
[...]

gem 'pg_search'
gem 'simple_form'
```

Puis on installe Simple Form et on lance les seeds.

```sh
rails db:drop db:create db:migrate
bundle install
rails generate simple_form:install --bootstrap
rails db:seed
```

### <a name="global"></a>1. Recherche globale par mots clés avec pg_search

On crée un scope dans le modèle

Nous allons commencer par une recherche par mots-clés sur les colonnes **description** et **address** des **Flat** avec un **scope** de **PgSearch**.

```ruby
# app/models/flat.rb

class Flat < ApplicationRecord
  AUTHORIZED_CATEGORIES = ["farm", "mansion", "castle"]
  include PgSearch::Model

  validates :category, inclusion: { in: AUTHORIZED_CATEGORIES }

  has_many :bookings

  pg_search_scope :search_by_description_and_address,
                  against: [ :description, :address ],
                  using: { tsearch: { prefix: true } }
end
```

Dans l'index, on va ajouter un formulaire et afficher les appartements.

```erb
<!-- app/views/flats/index.html.erb -->

<h1>Tous les appartements</h1>
<%= simple_form_for :search, method: :get,
                             defaults: { required: false } do |f| %>
  <%= f.input :search, label: "Recherche par adresse ou description",
                       input_html: { name: 'search',
                                     value: params.dig(:search) } %>
  <%= f.submit "Chercher" %>
<% end %>

<ul>
  <% @flats.each do |flat| %>
    <li>
      <%= flat.address %> | <%= flat.price_per_night %> € | <%= flat.description %> | <%= flat.category %>
    </li>
  <% end %>
</ul>
```

Si le params **search** est présent, on applique le scope **search_by_description_and_address** sur le model **Flat**

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

Nous pouvons désormais tester le formulaire avec `rails server` en visitant <a href="http://localhost:3000/flats" class="underlined" target="_blank">http://localhost:3000/flats</a> et en faisant une rechercher sur <a href="http://localhost:3000/flats?search=mouffetard" class="underlined" target="_blank">Mouffetard</a>

<img src="/images/posts/multisearch/recherche_globale.gif"
     class="image"
     alt="gif recherche globale">

<br>
<br>

### <a name="price"></a>2. Recherche par prix maximum

On ajoute un champ de recherche avec prix maximum

```erb
<!-- app/views/flats/index.html.erb -->

<%= simple_form_for :search, method: :get,
                             defaults: { required: false } do |f| %>
  <!-- [...]  -->
  <%= f.input :max_price, label: "Prix max",
                          required: false,
                          input_html: { type: :number,
                                        name: :max_price,
                                        value: params.dig(:max_price) } %>
  <!-- [...]  -->
<% end %>
```

Et on ajoute le filtre dans **FlatsController**

```ruby
# app/controllers/flats_controller.rb

class FlatsController < ApplicationController
  def index
    if params[:search].present?
      @flats = Flat.search_by_description_and_address(params[:search])
    else
      @flats = Flat.all
    end
    if params[:max_price].present?
      @flats = @flats.where("price_per_night <= ?", params[:max_price])
    end
  end
end
```

<img src="/images/posts/multisearch/champs_prix.png"
     class="image"
     alt="affichage champs prix">

<br>
<br>

### <a name="dates"></a>3. Recherche par catégorie

On ajoute un champ de recherche avec prix maximum

```erb
<!-- app/views/flats/index.html.erb -->

<%= simple_form_for :search, method: :get,
                             defaults: { required: false } do |f| %>
  <!-- [...]  -->
  <%= f.input :category, label: "Category",
                       collection: Flat::AUTHORIZED_CATEGORIES,
                       include_blank: true,
                       selected: params.dig(:category),
                       input_html: { name: :category } %>
  <!-- [...]  -->
<% end %>
```

```ruby
# app/controllers/flats_controller.rb

class FlatsController < ApplicationController
  def index
    if params[:search].present?
      @flats = Flat.search_by_description_and_address(params[:search])
    else
      @flats = Flat.all
    end
    if params[:max_price].present?
      @flats = @flats.where("price_per_night <= ?", params[:max_price])
    end
    if params[:category].present?
      @flats = @flats.where(category: params[:category])
    end
  end
end
```

Nous pouvons désormais tester en visitant  <a href="http://localhost:3000/flats?search=mouffetard&category=castle&max_price=&commit=Chercher" class="underlined" target="_blank">le filtre avec Mouffetard et la category castle</a>


### <a name="dates"></a>4. Recherche par dates

On ajoute les champs de date d'arrivée et de date de départ dans le formulaire.

```erb
<!-- app/views/flats/index.html.erb -->

<%= simple_form_for :search, method: :get,
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

Ensuite on vérifie la disponibilité des appartements

On définie une méthode d'instance **Flat#is_available?** avec deux paramètres, la date d'entrée et la date de sortie.

Dans cette méthode, on compare les dates recherchées et les dates de réservation. Pour cela on va utiliser **overlaps?** (cf. [documentation](https://apidock.com/rails/Range/overlaps%3F)).

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

Avec la méthode **select**, je sélectionne les appartements disponibles.

```ruby
#app/controllers/flat_controller.rb
class FlatsController < ApplicationController
  def index
   if params[:search].present?
      @flats = Flat.search_by_description_and_address(params[:search])
    else
      @flats = Flat.all
    end
    if params[:max_price].present?
      @flats = @flats.where("price_per_night <= ?", params[:max_price])
    end
    if params[:category].present?
      @flats = @flats.where(category: params[:category])
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
