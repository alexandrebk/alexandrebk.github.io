---
layout: post
title: “Utilisation avancées de Simple Form”
author: alexandre
difficulty: 1
status: draft
---

Dans ce tuto nous allons apprendre à ajouter des reviews sur notre application de réservations d’appartement avec une liste déroulante grâce à simple form.
Nous supposons qu’il y a un model `Booking` et `User`, et qu’il y’a déjà une application Rails avec plusieurs modèles.
Les utilisateurs vont avoir la possibilité de laisser une commentaire sur une location.

### Première étape

Tout d’abord nous allons générer une migration pour créer la table `reviews`

```sh
rails generate model Review content:text rating:integer user:references booking:references flat:references
```

Puis on lance la migration

```sh
rails db:migrate
```

On obtient cette migration


```ruby
class CreateReviews < ActiveRecord::Migration[5.2]
  def change
    create_table :reviews do |t|
    t.text :content
    t.integer :rating, default: 0
    t.references :user, foreign_key: true
    t.references :booking, foreign_key: true
    t t.references :flat, foreign_key: true
    t.timestamps
  end
end
```

Nous allons indiqué aux modèles `User`, `Booking` et `Flat` qu’ils ont has_many :reviews. Un petit tricks dans Rails. Si vous créez une méthode `name` dans le modèle, Simple_form va automatique aller la chercher pour afficher les dropdown. On profite d’être dans le modèle `User` pour la créer.

```ruby
# app/models/user.rb
class User < XXX
  [...]
  has_many :reviews, dependent: :destroy
  [...]

  def name
    "#{first_name} #{last_name}"
  end
end
```

```ruby
# app/models/flat.rb
class Flat < XXX
  [...]
  has_many :reviews, dependent: :destroy
end
```

```ruby
# app/models/booking.rb
class Booking < XXX
  [...]
  has_many :reviews, dependent: :destroy
end
```

### Seconde étape

Nous allons créer les routes.

```ruby
# config/routes.rb
Rails.application.routes.draw do
[...]
  resources :flats do
    resources :bookings, only: [:create, :new, :show, :destroy] do
      resources :reviews
    end
  end
end
```

Puis créer le controller

```
rails g controller reviews new create
```

Ensuite nous allons dans le controlleur pour lui passer les bonnes variables.

```ruby
# app/controllers/reviews_controllers.rb
class ReviewsController < ApplicationController

  def new
  end

  def create
    @user = current_user
    @flat = Flat.find(params[:flat_id])
    @booking = Booking.find(params[:id])
    @review = Review.new(review_params)
    @review.user = current_user
    @review.flat = @flat
    @review.booking = @booking
    if @review.save
      redirect_to flat_path(@flat.id)
    else
      render "bookings/show"
    end
  end

  private

  def review_params
    params.require(:review).permit(:content, :rating)
  end
end
```

### Troisième étape

On créé le formulaire de review dans la vue d’un booking.

```erb
<%= simple_form_for [@flat, @booking, @review] do |f| %>
  <%= f.input :content %>
  <%= f.input :rating %>
  <%= f.submit class: “btn btn-primary”%>
<% end %>
```

Puis nous voulons afficher les reviews dans la show du flat correspondant

```ruby
# app/controllers/flats.rb

def show
  [...]
  @reviews = Review.where(flat: @flat)
end
```

```erb
# app/views/flats/show.html.erb

<% @reviews.each do |review| %>
  <p><%= review.user.name %></p>
  <p><%= review.content %></p>
  <p><%= review.rating %></p>
<% end %>
```
