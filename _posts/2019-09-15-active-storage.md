---
layout: post
title:  "Utiliser Active Storage avec AWS S3"
seo_title: "AWS S3 Active Storage"
description: "Dans ce tuto nous allons apprendre comment ajouter plusieurs images à un modèle avec Active Storage et Amazon Web Services."
status: tech
tags: "active storage, amazon web services"
---

### Première étape: Installer Active Storage (rails < 6)

Si vous n'êtes pas dans Rails 6, il vous faudra ajouter la <a href="https://github.com/rails/activestorage/tree/archive" target="_blank">gem Active Storage</a> dans votre Gemfile et l'installer avec la commande `bundle install`.

```ruby
# Gemfile
gem 'activestorage'
```

On va l'installer avec la commande `rails active_storage:install` et créer les tables liant les photos aux modèles avec `rails db:migrate`.

```sh
$ rails active_storage:install
$ rails db:migrate
```

### Seconde Étape: Ajouter les images au model

Ensuite nous allons attacher des images à notre modèle `Flat`. Attention, contrairement à d'autres gems, il n'y a pas besoin de créer un nouveau champ.

```ruby
class Flat < ApplicationRecord
  has_many_attached :images
  # Si vous ne souhaitez attacher qu'une seule image :
  # has_one_attached :image
end
```

Dans le `flats_controller`, il faut autoriser l'upload d'images.

```ruby
# app/controllers/flats_controller.html.erb
  def flat_params
    params.require(:flat).permit(:title, :content, images: [])
  end
```

Et dans la vue du formulaire, on ajoute un champ pour les images.

```erb
<!-- app/views/flats/new.html.erb -->
<%= simple_form_for flat do |f| %>
  [...]
  <%= f.file_field :images, multiple: true, class: "form-control" %>
  <!-- Si vous avez qu'une seule image -->
  <%#= f.file_field :image, class: "form-control" %>
  [...]
<% end %>
```

Le formulaire est désormais utilisable sur `localhost`. On va donc afficher les images sur la `show` d'un flat.

### Troisième étape: Afficher les images

Comme je récupère un tableau d'images, je vais pouvoir itérer dessus et les inclure dans un caroussel Bootstrap.

```erb
<!-- app/views/flats/show.html.erb -->
<div class="flat-content">
  <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
    <!-- Vous pouvez remplacer @flat par votre modèle -->
      <% @flat.images.each_with_index do |image, index| %>
        <div class="carousel-item <%= "active" if index == 0%>">
          <%= image_tag image, height: 500, width: 700 %>
        </div>
      <% end %>
    </div>
    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
       <span class="carousel-control-next-icon" aria-hidden="true"></span>
       <span class="sr-only">Next</span>
    </a>
  </div>
</div>
```

<img src="/images/posts/active-storage/new_flat.gif" class="image">

### Quatrième Étape: Configurer AWS sur la prod

Suivre le tuto <a href="https://www.alexandrebouvier.fr/2021/08/09/rails-aws-s3.html" class="underlined" target="_blank">ici</a>

### [BONUS] Customiser sa zone de téléchargement

Le champ d'upload a nativement très peu de style.

<img src="/images/posts/active-storage/upload-before.png" class="image">

Tout d'abord, nous allons modifier notre formulaire. Attention il faut que le label ait le même nom que votre l'id de votre input Simple Form. Dans notre cas c'est `flat_images`. Pour une image cela aurait été `flat_image`. Je rajoute un div qui va accueillir le nom des fichiers. Et j'ajoute la classe `d-none` à l'ancien input de téléchargement des images.

```erb
<!-- app/views/flats/_form.html.erb -->
[..]
<%= simple_form_for flat do |f| %>
  [..]
  <label for="flat_images" class="btn-upload">
    Upload tes photos <i class="fas fa-cloud-upload-alt"></i>
  </label>
  <div id="flat-images-filename"></div>
  <%= f.file_field :images, as: :file, multiple: true, class: "form-control d-none" %>
  [..]
<% end %>
[..]
```

```css
/* app/assets/components/_button.scss */
.btn-upload {
  /* Enrichissez ici le style de votre button */
  cursor: pointer
}
```

```js
// app/javascript/packs/application.js
$("#flat_images").change(function() {
  Array.from(this.files).forEach((element) => {
    document.getElementById("flat-images-filename").innerHTML += `${element.name}<br>`
  });
});
```

<img src="/images/posts/active-storage/custom-upload.gif" class="image">
