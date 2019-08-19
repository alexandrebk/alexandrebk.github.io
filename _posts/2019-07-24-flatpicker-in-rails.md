---
layout: post
title:  "Comment griser des dates avec FlatPickr"
author: alexandre
difficulty: 4
---

Dans ce tuto nous allons apprendre comment griser des dates indisponibles avec FlatPickr. Cela suppose que vous avez déjà installé FlatPickr.

La doc de flatpicker est [ici](https://flatpickr.js.org/examples/#basic)

Le tuto officiel de FlatPickr pour désactiver des dates spécifiques est [ici](https://flatpickr.js.org/examples/#disabling-specific-dates)

[Ici](https://medium.com/@rodloboz/ruby-on-rails-date-validation-in-a-booking-and-disabling-dates-in-date-picker-3e5b4e9b4640) un article Medium en anglais qui explique comment faire.

### Première étape : récupérer les dates indisponibles

On va créer un tableau de hash avec toutes les locations. Tout d'abord on récupère l'id de l'appartement et on regarde quand il est loué.


```ruby
# app/controllers/flats_controller.rb

class FlatsController < ApplicationController
  # [...]
  def show
    @booking        = Booking.new
    @bookings       = Booking.where(flat: @flat)
    @bookings_dates = @bookings.map do |booking|
      {
        from: booking.start_date,
        to:   booking.end_date
      }
    end
  end
end
```

### Seconde étape : passer les données dans la vue avec un dataset

```erb
# app/views/flats/show.html.erb

<div
  id="booking-form-div"
  data-bookings="<%= @bookings_dates.to_json %>"
>
```


### Troisième étape : récupérer les données pour les injecter dans le calendrier

Dans le fichier `app/javascript/plugins/flatpickr.js` on récupère les données dans la div `getElementbyID`. On les parse en Json puis on grise les renting avec le `disable`.

```js
import flatpickr from "flatpickr"
import "flatpickr/dist/themes/airbnb.css" // Note this is important!

const bookingForm = document.getElementById('booking-form-div');

if (bookingForm) {
  const bookings = JSON.parse(bookingForm.dataset.bookings);
  flatpickr(".datepicker", {
    minDate: "today",
    inline: true,
    dateFormat: "Y-m-d",
    "disable": bookings,
  })
}
```

Vous pouvez retrouver un exemple de code [ici](https://github.com/alexandrebk/airbnb-copycat/commit/fce1dc96b3d0c2d25b9656ab836cbe88e18747ff)
