---
layout: post
title:  "Utiliser Active Storage avec AWS"
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

Le setup étant terminé pour l'environnement local, nous allons installer AWS sur la prod. Tout d'abord il faut ajouter la gem AWS dans le `Gemfile` et l'installer avec `bundle install`

```ruby
# Gemfile
gem "aws-sdk-s3", require: false
```

Pour créer un compte, allez <a href="https://aws.amazon.com/" target="_blank">sur le site d'Amazon Web Services</a>.Ensuite connectez vous à la console AWS. La configuration du compte se fera en 3 temps.

1. Créer son bucket (un espace de stockage).
2. Créer une stratégie d'accès pour les futurs utilisateurs.
3. Créer un utilisateur et lui associer une stratégie.

1 - Créer son bucket

Vous devez cliquer sur `Services` puis recherchez `S3`. Ensuite vous cliquez sur `Créer un compartiment`. Dans le nom du compartiment vous mettez le nom de votre app. Et pour la région, il faut choisir l'Irlande si vous êtes chez Heroku (afin que les 2 serveurs soit le plus proche possible).

<img src="/images/posts/active-storage/02.png" class="image">

2 - Créer une stratégie

Vous faites une nouvelle recherche dans `Services` et vous recherchez `IAM`. Nous allons maintenant créer une `stratégie`.

On va choisir un service, c'est à dire `S3`. Pour les actions manuelles, il faut cocher `Toutes les actions S3` et sélectionnez toutes les ressources. On clique sur examier une stratégie.

Pour le nom il faut être le plus clair possible en explicitant le nom du bucket et quels sont les droits (ici full access, l'utilisateur peut lire et écrire).

<img src="/images/posts/active-storage/10.png" class="image">

<img src="/images/posts/active-storage/12.png" class="image">

3 - Créer un utilisateur

Pour les utilisateurs il faut choisir un nom d'utilisateur et ensuite un service. Ici ça sera encore une fois S3. Ensuite on va sur l'onglet `Attacher les stratégies` pour ajouter celle qu'on a crée juste avant. Pour les étapes 3 et 4 on peut mettre OK. AWS va ensuite nous donner les clés API que l'on doit mettre sur Heroku sous le nom de `S3_ACCESS_KEY_ID` et `S3_SECRET_ACCESS_KEY`.

<img src="/images/posts/active-storage/14.png" class="image">

<img src="/images/posts/active-storage/15.png" class="image">

Et pour le type d'accès ça sera `programatique` c'est à dire que c'est un programme qui va y accéder et non un humain. Il n'y aura pas de mot de passe mais un token.

<img src="/images/posts/active-storage/13.png" class="image">

### Cinquième Étape: Configuration des variables d'environnement.

Il faut spécifier à Heroku (c'est à dire sur l'environnement de production) que Active Storage doit utiliser Amazon pour le stockage d'image.

```yaml
# config/storage.yml
local:
  service: Disk
  root: <%= Rails.root.join("storage") %>

test:
  service: Disk
  root: <%= Rails.root.join("tmp/storage") %>

amazon:
  service: S3
  access_key_id: <%= ENV['S3_ACCESS_KEY_ID'] %>
  secret_access_key: <%= ENV['S3_SECRET_ACCESS_KEY'] %>
  bucket: "airbnb-copycat"
  # Rempacer airbnb-copycat par le bucket que vous avez crée
  region: "eu-west-1"
  # Si vous avez choisi un bucket à Paris
  # region: "eu-west-3"
```

```ruby
# config/environments/production.rb
Rails.application.configure do
  [..]
  config.active_storage.service = :amazon
  [..]
end
```

### [BONUS] Seeder des images

```ruby
# db/seeds.rb
flat = Flat.create!(
  user:        User.last,
  address:     "55 rue du Faubourg Saint Honoré, 75008 Paris",
  surface:     120,
  price:       250,
  room:        4,
  description: "Amazing Office",
  max_guests:  8,
)
my_first_image_path = Rails.root.join('app', 'assets', 'images', 'my_first_image.png')
my_second_image_path = Rails.root.join('app', 'assets', 'images', 'my_second_image.png')
flat.images.attach(io: File.open(my_first_image_path), filename: 'image_name.png', content_type: 'image/png')
flat.images.attach(io: File.open(my_second_image_path), filename: 'image_name.png', content_type: 'image/png')
```

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
