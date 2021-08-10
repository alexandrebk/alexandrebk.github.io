---
layout:      post
title:       "Créer des reviews avec des étoiles ⭐⭐⭐⭐⭐"
description: "Dans ce tuto nous allons apprendre à ajouter des reviews sur notre application de réservations d’appartement avec une liste déroulante grâce à simple form."
difficulty:  1
status:      tech
---

### 1. Le setup

Tout d’abord on va créer notre application puis générer nos modèles *Flat*, *Booking* et *Review*.

```sh
$ rails new review_with_stars --database postgresql && cd review_with_stars
$ rails generate scaffold Flat description:text address:string price_per_night:integer
$ rails generate scaffold Booking flat:references starts_at:date ends_at:date
$ rails generate model Review content:text rating:integer booking:references
```

Ensuite on va ajouter les gems *simple_form* et *font-awesome*.

```ruby
# Gemfile
# [...]

gem 'simple_form'
gem 'font-awesome-sass', '~> 5.6.1'
```

On ajoute quelques *seed*.

```ruby
# db/seeds.rb

puts "Destroying all flats and bookings"
Booking.destroy_all
Flat.destroy_all

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

Booking.create!(starts_at: Date.today, ends_at: Date.today + 4, flat: gaudelet)
Booking.create!(starts_at: Date.today, ends_at: Date.today + 7, flat: universite)
Booking.create!(starts_at: Date.today, ends_at: Date.today + 2, flat: mouffetard)

puts "#{Booking.count} bookings created"
```

Puis on lance la migration, les seeds et l'installation de *simple_form*.

```sh
$ rails db:drop db:create db:migrate db:seed
$ bundle install
$ rails generate simple_form:install --bootstrap
$ rm app/assets/stylesheets/application.css
$ touch app/assets/stylesheets/application.scss
```

Enfin, on ajoute font-awesome dans notre *stylesheet*.

```scss
// app/assets/stylesheets/application.scss

@import "font-awesome-sprockets";
@import "font-awesome";
```

### 2. Les modèles

On va ajouter des validations sur les champs *content* et *rating*. La constante *AUTHORIZED_RATINGS* va contenir le *range* possible de notes.

```ruby
# app/models/review.rb

class Review < ApplicationRecord
  AUTHORIZED_RATINGS = (1..5)

  belongs_to :booking
  validates :content, presence: true
  validates :rating, inclusion: { in: AUTHORIZED_RATINGS }
end

```

```ruby
# app/models/booking.rb

class Booking < ApplicationRecord
  belongs_to :flat
  has_many :reviews, dependent: :destroy
end
```

```ruby
# app/models/flat.rb

class Flat < ApplicationRecord
  has_many :bookings, dependent: :destroy
  has_many :reviews,  through: :bookings
end
```

### 3. Les routes et le *ReviewsController*

Nous allons redéfinir les routes pour tenir compte des relations entre les modèles. Sur la documentation <a href="https://apidock.com/rails/Range/overlaps%3F" class= "underlined" target="_blank">Rails</a> vous trouverez des informations sur le *shallow nesting*.

```ruby
# config/routes.rb

Rails.application.routes.draw do
  resources :flats
  resources :bookings, only: [] do
    resources :reviews, shallow: true
  end
end
```

On va générer le *ReviewsController*.

```sh
$ rails generate controller reviews
```

Puis coder la méthode *create* dans le *ReviewsController*.

```ruby
# app/controllers/reviews_controllers.rb

class ReviewsController < ApplicationController
  def create
    @booking        = Booking.find(params[:booking_id])
    @review         = Review.new(review_params)
    @review.booking = @booking
    if @review.save
      redirect_to flat_path(@booking.flat)
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

Avant d'ajouter le formulaire dans la *show* d’un *booking* il faut créer une nouvelle instance de *Review* dans *BookingsController*.

```ruby
# app/controllers/bookings_controller.rb

class BookingsController < ApplicationController
  # [...]

  def show
    # [...]
    @review = Review.new
  end
end
```

Enfin, comme nous allons afficher toutes les *reviews* dans la *show* d'un *flat* il faut. ainsi la moyenne des notes.

```ruby
# app/controllers/flats_controller.rb
class FlatsController < ApplicationController
  # [...]

  def show
    # [...]
    @reviews        = @flat.reviews
    @average_rating = @reviews.average(:rating)
  end
end
```

### 4. Les vues

On va ajouter le formulaire dans la *show* d’un *booking*.

```erb
<!-- app/views/bookings/show.html.erb -->
<!-- [...] -->

<div class="review">
  <h2>Laissez une évaluation</h2>
  <%= simple_form_for [@booking, @review] do |f| %>
    <%= f.input :content %>
    <%= f.input :rating, collection: Review::AUTHORIZED_RATINGS,
                         include_blank: false %>
    <%= f.submit class: "btn btn-primary", value: "Valider" %>
  <% end %>
</div>
```

Une fois le formulaire remplie, il faut afficher les *reviews* dans la *show* d'un *flat*.

```erb
<!-- app/views/flats/show.html.erb -->
<!-- [...] -->

<p>
  Moyenne : <%= @average_rating %>
</p>
<div class="reviews">
  <% @reviews.each do |review| %>
    <p>
      <% Review::AUTHORIZED_RATINGS.each do |number| %>
        <i class="fa<%= (number > review.rating) ? 'r' : 's' %> fa-star"></i>
      <% end %>
      <%= review.content %>
    </p>
  <% end %>
</div>

<!-- [...] -->
```

On peut tester <a href="http://localhost:3000/bookings/" class= "underlined" target="_blank">ici</a>

<img src="/images/posts/rating/new-rating.gif"
     class="image"
     alt="new rating">

### 5. Afficher les étoiles

Pour une interface plus *friendly*, on va cacher l'*input* des notes et ajouter une liste d'étoiles.

```erb
<!-- app/views/bookings/show.html.erb -->
<!-- [...] -->

<div class="review">
  <h2>Laissez une évaluation</h2>
  <%= simple_form_for [@booking, @review] do |f| %>
    <%= f.input :content %>
    <%= f.input :rating, as: :hidden  %>
    <div class="my-3">
      <% Review::AUTHORIZED_RATINGS.each do |index| %>
        <i id="<%= index %>" class="review-rating far fa-star"></i>
      <% end %>
    </div>
    <%= f.submit class: "btn btn-primary", value: "Valider" %>
  <% end %>
</div>
```

On va ajouter un peu de css.

```css
// app/assets/stylesheets/application.scss

.fa-star {
  color:  #FFD700;
}

.review-rating {
  cursor:    pointer;
  font-size: 2rem;
}
```

À ce stade, nous avons bien les étoiles qui s'affichent dans le formulaire.

<img src="/images/posts/rating/formulaire.png"
     class="image"
     alt="formulaire">

Ajoutons l'effet de *hover* au passage de la souris et la sélection du nombre d'étoiles.

```sh
$ mkdir app/javascript/plugins && touch app/javascript/plugins/starsInReviewForm.js
```

```js
// app/javascript/plugins/starsInReviewForm.js

// je créé une fonction qui va changer la classe appliquée aux étoiles
const toggleColorStars = (stars, rating) => {
  stars.forEach((star) => {
    if (star.id <= rating) {
      star.className = "review-rating fas fa-star"
    } else {
      star.className = "review-rating far fa-star"
    }
  });
};

// je créé une fonction qui va récupérer la valeur du rating
const updateRatingInputForm = (rating) => {
  const formInput = document.getElementById('review_rating')
  formInput.value = rating
}

// je créé une fonction qui va appeler les deux premières fonctions
const dynamicRating = () => {
  // je récupère toutes les étoiles
  const stars = document.querySelectorAll('.review-rating');
  const starsReview = document.querySelector('#review-star-ratings');


  if ( stars.length > 0) {
    stars.forEach((star) => {
      // au clic je récupère la valeur du rating, j'applique le style css et j'ajoute une classe "selected" sur l'étoile
      star.addEventListener("click", (event) => {
        const rating = event.currentTarget.id
        updateRatingInputForm(rating);
        toggleColorStars(stars, rating);
        star.classList.add("selected")
      });
      star.addEventListener("mouseover", (event) => {
        // s'il n'y a pas de classe "selected" j'applique du style au passage de la souris
        const rating = event.currentTarget.id
        if (!(document.querySelector(".selected"))) {
          toggleColorStars(stars, rating);
        }
      });
    });
    starsReview.addEventListener("mouseout", (event) => {
      if (!(document.querySelector(".selected"))) {
        stars.forEach((star) => {
          star.className = "review-rating far fa-star"
        });
      }
    });
  };
};

export { dynamicRating };
```

```js
// app/javascript/packs/application.js

// [...]
import { dynamicRating } from "../plugins/starsInReviewForm";

document.addEventListener('turbolinks:load', () => {
  // [...]
  dynamicRating();
})
```

<img src="/images/posts/rating/javascript-stars.gif"
     class="image"
     alt="rating javascript">
