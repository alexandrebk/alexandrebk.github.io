---
layout: post
title:  "Comment gérer des dates avec FlatPickr dans des formulaires"
author: alexandre
difficulty: 4
---

Dans ce tuto nous allons apprendre comment griser des dates indisponibles avec FlatPickr. Cela suppose que vous avez déjà installé FlatPickr.

La doc de flatpicker est [ici](https://flatpickr.js.org/examples/#basic)

Le tuto officiel de FlatPickr pour désactiver des dates spécifiques est [ici](https://flatpickr.js.org/examples/#disabling-specific-dates)

[Ici](https://medium.com/@rodloboz/ruby-on-rails-date-validation-in-a-booking-and-disabling-dates-in-date-picker-3e5b4e9b4640) un article Medium en anglais qui explique comment faire.

### Première étape: le setup

Tout d'abord il faut installer flatpickr dans votre terminal.

```sh
yarn add flatpickr
```

Ensuite on va ajouter Javascript à votre `application.html` si ce n'est pas déjà fait:

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
    <%= stylesheet_pack_tag 'application' %> <!-- NEW! -->
  </head>
  <body>
    <%= yield %>
    <%= javascript_include_tag 'application' %>
    <%= javascript_pack_tag 'application' %> <!-- NEW! -->
  </body>
</html>
```

Si vous l'avez pas encore fait vous devez créer un dossier `plugins` dans `app/javascript` puis créez un fichier pour mettre le code de `flatpickr`.

```sh
mkdir -p  app/javascript/plugins
touch app/javascript/plugins/flatpickr.js
```

Ensuite dans le fichier `application.js` il faut importer le plugin.

```js
// app/javascript/packs/application.js
import "../plugins/flatpickr"
```

Enfin nous allons créer notre formulaire dans ma page `show` des mes `Flat`.

```erb
<div class="container">
  <div class="form-wrapper" style="width: 400px; margin: 0 auto;">
    <h2>Flatpickr Demo</h2>

    <%= simple_form_for [@flat, @booking] do |f| %>
      <%= f.input :starts_at, as: :string, required: false, input_html: {id: "range_start"} %>
      <%= f.input :ends_at, as: :string, required: false, input_html: {id: "range_end"} %>
      <%= f.button :submit, "Book", class: "btn btn-primary" %>
    <% end %>
  </div>
</div>
```

## Seconde étape

Maintenant que le formulaire est créer nous allons créer un tableau de hash avec toutes les locations. Tout d'abord on récupère l'id de l'appartement et on regarde quand il est loué.


```ruby
class FlatsController < ApplicationController
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
end
```

### Troisième Étape: on passe les données dans la vue avec un dataset

```html
# app/views/flats/show.html.erb

<div
  id="booking-form-div"
  data-bookings="<%= @bookings_dates.to_json %>"
>
```


### Quatrième Étape: on récupère les données pour les injecter dans le calendrier

Dans le fichier `app/javascript/plugins/flatpickr.js` on récupère les données dans la div `getElementbyID`. On les parse en Json puis on grise les bookings avec le `disable`.

```js
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

Vous pouvez retrouver un exemple de code [ici](https://github.com/alexandrebk/airbnb-copycat/commit/fce1dc96b3d0c2d25b9656ab836cbe88e18747ff)
