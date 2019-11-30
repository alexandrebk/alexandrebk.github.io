---
layout:     post
title:      "Ajouter des reviews et tricks pour Simple Form"
author:     alexandre
difficulty: 1
---

Dans ce tuto nous allons apprendre à ajouter des reviews sur notre application de réservations d’appartement avec une liste déroulante grâce à simple form.

Nous supposons qu’il y a un model `Booking` et `User`, et qu’il y’a déjà une application Rails avec plusieurs modèles.
Les utilisateurs vont avoir la possibilité de laisser une commentaire sur une location.

### Première étape : Les migrations et le modèle

Tout d’abord nous allons générer une migration pour créer la table `reviews`

```sh
rails generate model Review content:text rating:integer user:references booking:reference
```

Puis on lance la migration

```sh
rails db:migrate
```

On va ajouter des validations sur les champs `content` et `rating`

```ruby
class Review < ApplicationRecord
  belongs_to :user
  belongs_to :booking
  validates :content, presence: true
  validates :rating,  numericality: { greater_than: 0, less_than_or_equal_to: 5 }
end
```

Il faut modifier les modèles `User`, `Booking` et `Flat` et leur indiquer qu’ils ont plusieurs `reviews`.

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

### Seconde étape: Les routes et le Controlleur

Nous allons ajouter des routes pour la création de `reviews`.

```ruby
# config/routes.rb
Rails.application.routes.draw do
  [...]
  resources :bookings do
    resources :reviews, only [:create]
  end
end
```

Ensuite on va créer le controller

```sh
rails g controller reviews
```

Ensuite nous allons dans le controlleur pour coder la méthode create

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

### Troisième étape : Les vues

On ajoute une review dans la `show` d’un `booking`. Il faut d'abord créer une nouvelle instance de `review` dans le controlleur de `booking`

```ruby
# app/controllers/bookings_controller.rb
class BookingsController < ApplicationController
  [..]

  def show
    [..]
    @review = Review.new
  end
end
```

Ensuite nous allons coder la vue éponyme. Pour une interface plus friendly on ajouter une liste d'étoile pour noter. On va cacher l'input et ajouter des étoiles vides.

```erb
<!-- app/views/bookings/show.html.erb -->
[..]
<%= simple_form_for [@booking, @review] do |f| %>
  <%= f.input :content %>
  <%= f.input :rating, as: :hidden  %>
  <div>
    <% 5.times do %>
      <i class="far fa-star"></i>
    <% end %>
  </div>
  <%= f.submit class: "btn btn-primary" %>
<% end %>
[..]
```

```js
// app/javascript/plugins/starsInReviewForm.js
const toggleStarsInBlack = (rating) => {
  for (let i = 1; i <= 5; i++) {
    const star = document.getElementById(i);
    if (i <= rating) {
      star.classList.remove("far");
      star.classList.add("fas");
    } else {
      star.classList.remove("fas");
      star.classList.add("far");
    }
  }
};

const updateRatingInput = (rating) => {
  const formInput = document.getElementById('review_rating')
  formInput.value = rating
}

const dynamicRating = () => {
  const stars = document.querySelectorAll('.review-rating');
  if ( stars.length > 0) {
    stars.forEach((star) => {
      star.addEventListener("click", (event) => {
        const rating = event.currentTarget.id
        toggleStarsInBlack(rating);
        updateRatingInput(rating);
      });
    });
  };
};

export { dynamicRating };
```

```js
// app/javascript/packs/application.js
[..]
import { dynamicRating } from "../plugins/starsInReviewForm";

dynamicRating();
```

Puis nous voulons afficher toutes les `reviews` dans la `show` du `flat`.

```ruby
# app/controllers/flats_controller.rb
class FlatsController < ApplicationController
  [..]

  def show
    [...]
    @reviews = @flat.reviews
  end
end
```

Nous allons coder la vue éponyme.

```erb
<!-- app/views/flats/show.html.erb -->
[..]
<% @reviews.each do |review| %>
  <p><%= review.user.name %></p>
  <p><%= review.content %></p>
  <p>
    <% review.rating.times do %>
      <i class="fas fa-star"></i>
    <% end %>
    <% (5 - review.rating).times do %>
      <i class="far fa-star"></i>
    <% end %>
  </p>
<% end %>
[..]
```

### [BONUS] Les collections dans Simple Form

On va ajouter un page `new` pour les reviews.

Tout d'abord il faut ajouter la route.

```ruby
# config/routes.rb
Rails.application.routes.draw do
  [...]
  resources :reviews, only: [:new, :create]
end
```

Puis la méthode du controlleur.

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

Un petit tricks dans Rails. Si vous créez une méthode `name` dans un modèle, `simple_form` va automatiquement aller la chercher pour afficher les données. Et lors de la soumission du formulaire, il va récupérer l'id du modèle.

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
    <div>
      <% 5.times do %>
        <i class="far fa-star"></i>
      <% end %>
    </div>
    <%= f.submit class: "btn btn-primary" %>
  <% end %>
</div>
```
