---
layout: post
title:  "Comment griser des dates avec FlatPickr"
author: alexandre
---

Dans ce tuto nous allons apprendre comment griser des dates avec FlatPickr. Cela suppose que vous avez déjà installé FlatPickr.

La doc de flatpicker est [ici](https://flatpickr.js.org/examples/#basic)

Le tuto officiel de FlatPickr pour désactiver des dates spécifiques est [ici](https://flatpickr.js.org/examples/#disabling-specific-dates)

[Ici](https://medium.com/@rodloboz/ruby-on-rails-date-validation-in-a-booking-and-disabling-dates-in-date-picker-3e5b4e9b4640) un article Medium qui explique comment faire

### Première étape:

On va créer un tableau de hash avec toutes les locations. Tout d'abord on récupère l'id de l'appartement et on regarde quand il est loué.


```ruby
class FlatsController < ApplicationController
  def show
    @flat           = Flat.find(params[:id])
    @rentings       = Renting.where(flat_id: @flat.id)
    @rentings_dates = @rentings.map do |renting|
      {
        from: renting.start_date,
        to:   renting.end_date
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

Dans le fichier `app/javascript/plugins/flatpickr.js` on récupère les données dans la div `getElementbyID`. On les parse en Json puis on grise les renting avec le `disable`.

```js
import flatpickr from "flatpickr"
import "flatpickr/dist/themes/airbnb.css" // Note this is important!

const rentingForm = document.getElementById('renting-form-div');
const rentings = JSON.parse(rentingForm.dataset.rentings);

if (rentingForm) {
  flatpickr(".datepicker", {
    minDate: "today",
    inline: true,
    dateFormat: "Y-m-d",
    "disable": rentings,
  })
}
```
