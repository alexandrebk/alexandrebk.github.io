---
layout: post
title:  "Ajouter un calendrier Flatpickr pour gérer les dates disponibles"
description: "Dans ce tuto nous allons apprendre à installer Flatpickr dans une application Rails et à gérer les dates disponibles."
status: tech
tags: "flatpickr, datepickr"
---

Les calendriers et les sélecteurs de date sont toujours difficiles à mettre en place dans un formulaire. Heureusement, il existe souvent des packages JS qui nous permettre de mettre ça en place facilement.

Pour afficher un calendrier sélecteur de dates, nous allons utiliser le package <a href="https://flatpickr.js.org" class= "underlined" target="_blank">Flatpickr</a>.

## 1. Installation

Tout d'abord il faut ajouter le package flatpickr dans votre application.

```sh
$ yarn add flatpickr
```

Nous allons maintenant créer notre formulaire dans la page `show` des `Flat`.

```erb
<!-- app/views/flats/show.html.erb -->

<!-- [...] -->

<div class="container">
  <div class="form-wrapper">
    <h2>Book a flat</h2>
    <%= simple_form_for [@flat, @booking] do |f| %>
      <%= f.input :start_date, as: :string,
                               required: false,
                               input_html: { id: "range_start" } %>
      <%= f.input :end_date, as: :string,
                             required: false,
                             input_html: { id: "range_end" } %>
      <%= f.button :submit, "Book", class: "btn btn-primary" %>
    <% end %>
  </div>
</div>
```

<img src="/images/posts/flatpickr/flatpickr-avec-input.png"
     class="image"
     alt="calendrier flatpickr">

## 2. Le contrôleur

Maintenant que le formulaire est créé, nous allons créer un tableau de hash avec les locations déjà existantes. On récupère d'abord l'id de l'appartement. Enfin, avec une méthode `.map` on transforme les réservations en hash avec la date de début et de fin.


```ruby
# app/controllers/flats_controller.rb

class FlatsController < ApplicationController
  # [...]
  def show
    @flat           = Flat.find(params[:id])
    @bookings       = @flat.bookings
    @bookings_dates = @bookings.map do |booking|
      {
        from: booking.start_date,
        to:   booking.end_date
      }
    end
  end
  # [...]
end
```

## 3. Passer les données à la vue

Une fois créé, on place le tableau de hash dans la vue sous forme de data-set à la fin de la page.

```erb
<!-- app/views/flats/show.html.erb -->

<!-- [...] -->

<div id="booking-form-div"
     data-bookings="<%= @bookings_dates.to_json %>">
</div>
```

## 4. Récupèrer les données pour les injecter dans le calendrier

S'il n'est pas déjà existant vous devez créer un dossier `plugins` dans `app/javascript` puis créer un fichier `flatpickr.js`.

```sh
$ mkdir -p app/javascript/plugins
$ touch app/javascript/plugins/flatpickr.js
```

```css
// app/assets/stylesheets/application.scss
// [...]

@import "flatpickr/dist/flatpickr";
```

Dans le fichier `app/javascript/plugins/flatpickr.js` on récupère les données dans la div avec `getElementbyID`. Puis on les parse en JSON et on grise les réservations avec le `disable`.

```js
// app/javascript/plugins/flatpickr.js

import flatpickr from "flatpickr"
import rangePlugin from "flatpickr/dist/plugins/rangePlugin"


const initFlatpickr = () => {
  const bookingForm = document.getElementById('booking-form-div');
  if (bookingForm) {
    const bookings = JSON.parse(bookingForm.dataset.bookings);
    flatpickr("#range_start", {
      plugins: [new rangePlugin({ input: "#range_end"})],
      minDate: "today",
      inline: true,
      dateFormat: "Y-m-d",
      "disable": bookings,
    })
  }
};

export { initFlatpickr };
```

Ensuite dans le fichier `application.js` il faut importer la fonction `initFlatpickr`, puis l'appeler quand Turbolinks est chargé.

```js
// app/javascript/packs/application.js

import { initFlatpickr } from '../plugins/flatpickr';

document.addEventListener('turbolinks:load', () => {
  initFlatpickr();
})
```

<img src="/images/posts/flatpickr/gif-flatpickr-disable.gif"
     class="image"
     alt="flatpickr dates grisées">


## 5. Afficher uniquement le calendrier

Maintenant on va cacher les champs du dates pour ne laisser apparaître que le calendrier.

Tout d'abord, il faut ajouter un label au calendrier. Ensuite on va cacher les deux champs avec la classe Bootstrap `d-none`.

```erb
<!-- app/views/flats/show.html.erb -->

<div class="container">
  <div class="form-wrapper">
    <h2>Book a flat</h2>
    <%= simple_form_for [@flat, @booking] do |f| %>
      <%= f.input :start_date, label: "Sélectionnez vos dates:",
                               as: :string,
                               required: false,
                               input_html: { id: "range_start", class: "d-none"} %>
      <%= f.input :end_date, label: false,
                             as: :string,
                             required: false,
                             input_html: { id: "range_end", class: "d-none" } %>
      <%= f.button :submit, "Book", class: "btn btn-primary" %>
    <% end %>
  </div>
</div>
```

<img src="/images/posts/flatpickr/flatpickr-sans-input.png"
     class="image"
     alt="calendrier flatpickr">

## Bonus : Vérifier les dates en back-end

Si vous souhaitez effectuer une vérification sur les dates avant d'enregistrer la réservation, vous pouvez utiliser la méthode <a href="https://apidock.com/rails/Range/overlaps%3F" class="underlined" target="_blank">overlaps?</a>

## Bonus n°2 : Afficher le prix total de façon dynamique

Souvent sur ce type d'application, le prix total s'affiche et se modifie en fonction des dates sélectionnées. Le tuto pour l'affichage dynamique, c'est <a href="/2020/03/31/dynamic-element.html" class="underlined">ici</a>
