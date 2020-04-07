---
layout: post
title:  "Ajouter un calendrier Flatpickr pour gérer les dates disponibles"
description: "Dans ce tuto nous allons apprendre à installer Flatpickr dans une application Rails et à gérer les dates disponibles."
status: tech
---

Les éléments UX comme les formulaires, les calendriers, les sélecteurs de date sont difficiles à mettre en oeuvre. Pourtant ce sont les éléments que tous vos utilisateurs attendent avec évidence sur votre application. Heureusement il existe souvent des plugins qui nous évite des heures de code.

Pour afficher un calendrier sélecteur de dates, nous allons utiliser `Flatpickr`.

### Première étape : installation

Tout d'abord il faut ajouter le package flatpickr dans votre application.

```sh
$ yarn add flatpickr
```

Ensuite on va ajouter Webpack à votre `layout/application.html` si ce n'est pas déjà fait :

```erb
<!-- app/views/layouts/application.html.erb -->

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>TODO</title>
    <%= csrf_meta_tags %>
    <%= action_cable_meta_tag %>
    <%= stylesheet_link_tag 'application', media: 'all' %>
    <%= stylesheet_pack_tag 'application' %> <!-- à ajouter! -->
  </head>
  <body>
    <%= yield %>
    <%= javascript_include_tag 'application' %>
    <%= javascript_pack_tag 'application' %> <!-- à ajouter! -->
  </body>
</html>
```

S'il n'est pas déjà existant vous devez créer un dossier `plugins` dans `app/javascript` puis créer un fichier `flatpickr.js` dans ce dossier pour mettre le code de `flatpickr`.

```sh
mkdir -p  app/javascript/plugins
touch app/javascript/plugins/flatpickr.js
```

Ensuite dans le fichier `application.js` il faut importer le code que nous allons mettre dans le fichier `flatpickr.js`.

```js
// app/javascript/packs/application.js
import "../plugins/flatpickr"
```

Nous allons maintenant créer notre formulaire dans la page `show` des `Flat`.

```erb
<div class="container">
  <div class="form-wrapper">
    <h2>Book a flat</h2>
    <%= simple_form_for [@flat, @booking] do |f| %>
      <%= f.input  :start_date, as: :string, required: false, input_html: {id: "range_start"} %>
      <%= f.input  :end_date,   as: :string, required: false, input_html: {id: "range_end"} %>
      <%= f.button :submit, "Book", class: "btn btn-primary" %>
    <% end %>
  </div>
</div>
```

<img src="/images/posts/flatpickr/flatpickr-avec-input.png" class="image" alt="calendrier flatpickr">


### Seconde étape : le contrôleur

Maintenant que le formulaire est créé nous allons créer un tableau de hash avec les locations déjà existantes. On récupère d'abord l'id de l'appartement. Enfin, avec une méthode `.map` on transforme les réservations en hash avec la date de début et de fin.


```ruby
# app/controllers/flats_controller.rb

class FlatsController < ApplicationController
  [...]
  def show
    @flat           = Flat.find(params[:id])
    @bookings       = Booking.where(flat_id: @flat.id)
    @bookings_dates = @bookings.map do |booking|
      {
        from: booking.start_date,
        to:   booking.end_date
      }
    end
  end
  [...]
end
```

### Troisième étape : on passe les données à la vue

Une fois créé, on place le tableau de hash dans la vue sous forme de data-set.

```erb
<!-- app/views/flats/show.html.erb -->

<div
  id="booking-form-div"
  data-bookings="<%= @bookings_dates.to_json %>"
>
```

### Quatrième étape : on récupère les données pour les injecter dans le calendrier


Dans le fichier `app/javascript/plugins/flatpickr.js` on récupère les données dans la div `getElementbyID`. On les parse en JSON puis on grise les réservations avec le `disable`.

```js
// app/javascript/plugins/flatpickr.js

import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.min.css" // Note this is important!
import rangePlugin from "flatpickr/dist/plugins/rangePlugin"

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
```

<img src="/images/posts/flatpickr/gif-flatpickr-disable.gif" class="image" alt="flatpickr dates grisées">


### Cinquième étape : afficher uniquement le calendrier

Maintenant on va cacher les champs du dates pour ne laisser apparaître que le calendrier.
Tout d'abord, il faut ajouter un label au calendrier. Ensuite on va cacher les deux champs avec la classe Bootstrap `d-none`.

```erb
<!-- app/views/flats/show.html.erb -->

<div class="container">
  <div class="form-wrapper">
    <h2>Book a flat</h2>
    <%= simple_form_for [@flat, @booking] do |f| %>
      <%= f.input :start_date, label: "Sélectionnez vos dates:", as: :string, required: false, input_html: { id: "range_start", class: "d-none"} %>
      <%= f.input :end_date, label: false, as: :string, required: false, input_html: { id: "range_end", class: "d-none" } %>
      <%= f.button :submit, "Book", class: "btn btn-primary" %>
    <% end %>
  </div>
</div>
```

<img src="/images/posts/flatpickr/flatpickr-sans-input.png" class="image" alt="calendrier flatpickr">

### Bonus pour vérifier les dates en back-end

Si vous souhaitez effectuer une vérification sur les dates avant d'enregistrer la réservation, vous pouvez utiliser la méthode [overlaps?](https://apidock.com/rails/Range/overlaps%3F)


### Bonus bis pour afficher le prix total de façon dynamique

Souvent sur ce type d'application, le prix total s'affiche et se modifie en fonction des dates sélectionnées. Le tuto pour l'affichage dynamique, c'est [ici](/2020/03/31/dynamic-element.html)

La doc officielle de flatpicker est disponible [ici](https://flatpickr.js.org/examples/#basic)
