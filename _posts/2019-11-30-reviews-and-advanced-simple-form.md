---
layout:      post
title:       "Ajouter une évaluation en étoiles  avec Javascript et afficher la note moyenne"
description: "Dans ce tuto nous allons apprendre à ajouter des reviews sur notre application de réservations d’appartement avec une liste déroulante grâce à simple form."
difficulty:  1
status:      tech
---

Nous supposons qu’il y a une application Ruby on Rails de location d'appartement type Airbnb avec des modèles `Booking` et `User`. Nous allons créer des commentaires (*reviews*) sur les locations d'appartements.

### Première étape : Les migrations

Tout d’abord nous allons générer une migration pour créer la table *reviews*.

```sh
$ rails generate model Review content:text rating:integer user:references booking:references
```

Puis on lance la migration.

```sh
$ rails db:migrate
```

### Deuxième étape : Le modèle

On va ajouter des validations sur les champs *content* et *rating*.

```ruby
# app/models/review.rb

class Review < ApplicationRecord
  belongs_to :user
  belongs_to :booking
  validates :content, presence: true
  validates :rating,  numericality: { greater_than: 0, less_than_or_equal_to: 5 }
end
```

Mettons à jour les modèles `User`, `Booking` et `Flat`.

```ruby
# app/models/user.rb

class User < ApplicationRecord
  [...]
  has_many :reviews, dependent: :destroy
end
```

```ruby
# app/models/booking.rb

class Booking < ApplicationRecord
  [...]
  has_many :reviews, dependent: :destroy
end
```

```ruby
# app/models/flat.rb

class Flat < ApplicationRecord
  [...]
  has_many   :bookings, dependent: :destroy
  has_many   :reviews,  through: :bookings
end
```

### Troisième étape : Les routes et le contrôleur

Nous allons ajouter une route pour la création d'une *review*.
Une évaluation appartient à une réservation. Donc nous allons nester les `reviews` dans les `bookings`.

```ruby
# config/routes.rb

Rails.application.routes.draw do
  [...]
  resources :bookings do
    resources :reviews, only: [:create]
  end
end
```

Ensuite on va générer le *controller* *reviews*.

```sh
$ rails g controller reviews
```

Ensuite nous allons dans le *controller* pour coder la méthode *create*.

```ruby
# app/controllers/reviews_controllers.rb

class ReviewsController < ApplicationController
  def create
    @booking        = Booking.find(params[:booking_id])
    @review         = Review.new(review_params)
    @review.user    = current_user
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

### Quatrième étape : Liste d'étoiles dans le formulaire

On ajoute une review dans la *show* d’un *booking*. Pour cela, il faut d'abord créer une nouvelle instance de *review* dans le controlleur des *bookings*.

```ruby
# app/controllers/bookings_controller.rb

class BookingsController < ApplicationController
  [...]

  def show
    [...]
    @review = Review.new
  end
end
```
Nous souhaitons que le formulaire d'évaluation ne s'affiche que si la réservation est terminée, et que l'utilisateur ne l'a pas encore évalué. Pour vérifier cela, nous allons créer une méthode d'instance dans le modèle `Booking.rb`.

```ruby
# app/models/booking.rb

[...]
def display_review_form(user)
  (self.end_date < Date.today) && (self.reviews.find_by(user: user).nil?)
end
```

Ensuite nous allons coder la vue éponyme. Pour une interface plus *friendly*, on va cacher l'input des notes et ajouter une liste d'étoiles.

```erb
<!-- app/views/bookings/show.html.erb -->

[...]
<% if @booking.display_review_form(current_user) %>
  <div class="review">
    <h2>Laissez une évaluation</h2>
    <%= simple_form_for [@booking, @review] do |f| %>
      <%= f.input :content %>
      <%= f.input :rating, as: :hidden  %>
      <div class="my-3">
        <% 5.times do |index| %>
          <i id="<%= index + 1 %>" class="review-rating far fa-star"></i>
        <% end %>
      </div>
      <%= f.submit class: "btn btn-primary", value: "Valider" %>
    <% end %>
  </div>
<% end %>
[...]
```

```css
/* app/assets/stylesheets/components/_form.scss */

.fa-star {
  color:  #FFD700;
  cursor: pointer;
}
.review i {
  font-size: 32px;
}
```

```css
/* app/assets/stylesheets/components/_index.scss */

[...]
@import "form";
[...]
```

À ce stade, nous avons un formulaire qui s'affiche sur la *show* d'un `booking`.

<img src="/images/posts/rating/formulaire.png" class="image" alt="formulaire">

Ajoutons l'effet de *hover* au passage de la souris et la sélection du nombre d'étoiles.

```js
// app/javascript/plugins/starsInReviewForm.js

// je créé une fonction qui va changer la classe appliquée aux étoiles
const toggleStarsInBlack = (rating) => {
  for (let index = 1; index <= 5; index++) {
    const star = document.getElementById(index);
    if (index <= rating) {
      star.className = "review-rating fas fa-star"
    } else {
      star.className = "review-rating far fa-star"
    }
  }
};

// je créé une fonction qui va récupérer la valeur du rating
const updateRatingInput = (rating) => {
  const formInput = document.getElementById('review_rating')
  formInput.value = rating
}

// je créé une fonction qui va appeler les deux premières fonctions
const dynamicRating = () => {
  // je récupère toutes les étoiles
  const stars = document.querySelectorAll('.review-rating');
  if ( stars.length > 0) {
    stars.forEach((star) => {
      // au clic je récupère la valeur du rating, j'applique le style css et j'ajoute une classe "selected" sur l'étoile
      star.addEventListener("click", (event) => {
        const rating = event.currentTarget.id
        updateRatingInput(rating);
        toggleStarsInBlack(rating);
        star.classList.add("selected")
      });
      star.addEventListener("mouseover", (event) => {
        // s'il n'y a pas de classe "selected" j'applique du style au passage de la souris
        const rating = event.currentTarget.id
        if (!(document.querySelector(".selected"))) {
          toggleStarsInBlack(rating);
        }
      });
    });
  };
};

export { dynamicRating };
```

```js
// app/javascript/packs/application.js

[...]
import { dynamicRating } from "../plugins/starsInReviewForm";

dynamicRating();
```
<img src="/images/posts/rating/javascript-stars.gif" class="image" alt="rating javascript">

### Cinquième étape : Afficher les *reviews* et la moyenne

Nous allons afficher toutes les *reviews* dans la *show* d'un *flat*. Et aussi la moyenne des notes.

```ruby
# app/controllers/flats_controller.rb
class FlatsController < ApplicationController
  [...]

  def show
    [...]
    @reviews        = @flat.reviews
    @average_rating = @reviews.average(:rating)
  end
end
```

Nous allons coder la vue éponyme.

```erb
<!-- app/views/flats/show.html.erb -->

[...]
<p>Moyenne : <%= @average_rating %></p>
[...]
<div class="reviews">
  <% @reviews.each do |review| %>
    <p>
      <%= review.user.first_name %>
      <% review.rating.times do %>
        <i class="fas fa-star"></i>
      <% end %>
      <% (5 - review.rating).times do %>
        <i class="far fa-star"></i>
      <% end %>
    </p>
    <p><%= review.content %></p>
  <% end %>
</div>
[...]
```

<img src="/images/posts/rating/new-rating.gif" class="image" alt="new rating">


### Bonus pour des listes déroulantes dans *Simple Form*

Nous allons voir une autre façon d'aborder les *reviews*. Au lieu d'ajouter une évaluation depuis la *show* d'un booking, nous allons ajouter les évaluations depuis une page unique en sélectionnant le booking dans une liste déroulante.
Attention c'est méthode ne se cumule pas à la précédente. Cependant nous pouvons conserver le fichier `starsInReviewForm.js` pour le *rating* en étoiles.

Tout d'abord, il faut ajouter la route.

```ruby
# config/routes.rb

Rails.application.routes.draw do
  [...]
  resources :reviews, only: [:new, :create]
end
```

Puis la méthode du *controller*.

```ruby
# app/controllers/bookings_controller.rb

class BookingsController < ApplicationController
  def new
    @review   = Review.new
    @bookings = current_user.bookings
  end

  def create
    # Attention l'ancien formulaire n'est plus disponible
    @review         = Review.new(review_params)
    @review.user    = current_user
    if @review.save
      redirect_to flat_path(@review.booking.flat)
    else
      render "new"
    end
  end

  private

  def review_params
    params.require(:review).permit(:content, :rating, :booking_id)
  end
end
```

Un petit tricks dans Rails. Si vous créez une méthode *name* dans un modèle, *simple_form* va automatiquement aller la chercher pour afficher les données. Et lors de la soumission du formulaire, il va récupérer l'*id* du modèle.

```ruby
# app/models/booking.rb

class Booking < ApplicationRecord
  [...]
  def name
    "#{self.flat.address}, du #{self.start_date.strftime("%m/%d/%Y")} au #{self.end_date.strftime("%m/%d/%Y")}"
  end
end
```

Et enfin la vue.

```erb
<!-- app/views/reviews/new.html.erb -->

<div class="container">
  <%= simple_form_for [@review] do |f| %>
    <!-- On donne la liste des bookings via une collection -->
    <%= f.input :booking_id, collection: @bookings %>
    <%= f.input :content %>
    <%= f.input :rating, as: :hidden  %>
    <div class="my-3">
     <% 5.times do |index| %>
      <i id="<%= index + 1 %>" class="review-rating far fa-star"></i>
     <% end %>
    </div>
    <%= f.submit class: "btn btn-primary" %>
  <% end %>
</div>
```

<img src="/images/posts/rating/formulaire-new.gif" class="image" alt="form rating">
