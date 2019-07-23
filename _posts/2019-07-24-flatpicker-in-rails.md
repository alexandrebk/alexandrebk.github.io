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

### Première étape:

On va créer un tableau de hash avec toutes les locations.
Tout d'abord on récupère l'id de l'appartement à l'aide de before_action (ou on ajoute l'action :show si le before_action est déjà existant)

```ruby
# app/controllers/bookings_controller.rb

class BookingsController < ApplicationController
  before_action :set_flat, only: [:show]

    [...]

    private

    def set_flat
      @flat = Flat.find(params[:flat_id])
    end
  end
```

Ensuite on regarde quand l'appartement est loué et on stocke les dates.


```ruby
class FlatsController < ApplicationController
  def show
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

### Seconde Étape: on passe les données dans la vue avec un dataset

```html
# app/views/flats/show.html.erb

<div
  id="renting-form-div"
  data-rentings="<%= @rentings_dates.to_json %>"
>
```


### Trosième Étape: on récupère les données pour les injecter dans le calendrier

Dans cet exemple nous avons ajouté le plugin "range" pour que l'utilisateur reste sur le même calendrier pour choisir la date de début et la date de fin de son séjour.

Dans le fichier `app/javascript/plugins/flatpickr.js` on récupère les données dans la div avec `getElementbyID`. On les parse en Json puis on grise les renting avec le `disable`.

```js
# app/javascript/plugins/flatpickr.js

import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.min.css" // Note this is important!
import rangePlugin from "flatpickr/dist/plugins/rangePlugin"

const bookingForm = document.getElementById('booking-form-div');

if (bookingForm) {
  const bookings = JSON.parse(bookingForm.dataset.bookings);
  flatpickr("#range_start", {
    plugins: [new rangePlugin({ input: "#range_end"})],
    minDate: "today",
    dateFormat: "Y-m-d",
    "disable": bookings,
 })
}
```
