---
layout: post
author: alexandre
---

# Comment griser des dates indisponibles avec FlatPickr

Dans ce tuto nous postulons que vous avez déjà installé FlatPickr.

La doc de flatpicker est [ici](https://flatpickr.js.org/examples/#basic)

Le tuto officiel de FlatPickr pour désactiver des dates spécifiques est [ici](https://flatpickr.js.org/examples/#disabling-specific-dates)

[Ici](https://medium.com/@rodloboz/ruby-on-rails-date-validation-in-a-booking-and-disabling-dates-in-date-picker-3e5b4e9b4640) un article Medium qui explique comment faire

### Première étape: 

On va créer un tableau de hash avec toutes les locations. Tout d'abord on récupère l'id de l'appartement et on regarde quand il est loué.

```
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

```
# app/views/flats/show.html.erb
<div
  id="renting-form-div"
  data-rentings="<%= @rentings_dates.to_json %>"
>
```

### Trosième Étape: on récupère les données pour les injecter dans le calendrier

Dans le fichier `app/javascript/plugins/flatpickr.js` on récupère les données dans la div `getElementbyID`. On les parse en Json puis on grise les renting avec le `disable`.

```
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

## Calcul automatique de Prix


### D'abord on récupère les prix avec GetElementbyId

```
const startDate = document.getElementById("booking_start_date");
const endDate = document.getElementById("booking_end_date");
```

### Ensuite on fait les calculs

```
if(endDate) {
  endDate.addEventListener("change", (event) => {
  let dateDiffInMilliseconds = new Date(endDate.value) - new Date(startDate.value) + 86400000;
  let days = dateDiffInMilliseconds / 86400000;
  document.getElementById("days").innerText = `${days} days`
  document.getElementById("price_per_day").innerText = `${(dateDiffInMilliseconds/ 86400000) * 75}€`
});
}```


