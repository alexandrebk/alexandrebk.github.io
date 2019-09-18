---
layout: post
title:  "Ajouter des images avec Active Storage"
author: alexandre
---

Dans ce tuto nous allons apprendre comment ajouter plusieurs images à un modèle avec Active Storage.

### Première étape: Installer Active Storage

Si vous n'êtes pas dans Rails 6, il vous faudra ajouter la [gem Active Storage](https://github.com/rails/activestorage/tree/archive) dans votre Gemfile et l'installer avec la commande `bundle install`.

```ruby
# Gemfile
gem 'activestorage'
```

On va l'installer avec la commande `rails active_storage:install` et créer les tables liant les photos aux modèles avec `rails db:migrate`.

```sh
rails active_storage:install
rails db:migrate
```

### Seconde Étape: Ajouter les images au model

Ensuite nous allons attacher des images à notre modèle `Flat`. Contrairement à d'autres gems il n'y a pas besoin de créer une nouvelle colonne dans la table du modèle.

```ruby
class Flat < ApplicationRecord
  has_many_attached :images
end
```

Puis il faut autoriser les images dans les paramètres de notre formulaire de `Flat`.

```ruby
# app/controllers/flats_controller.html.erb
  def flat_params
    params.require(:flat).permit(:title, :content, images: [])
  end
```

Et ajouter dans la vue du formulaire un champ pour ajouter des images.

```erb
<!-- app/views/flats/new.html.erb -->
<%= simple_form_for flat do |f| %>
  [...]
  <%= f.file_field :images, multiple: true, class: "form-control" %>
  [...]
<% end %>
```

### Trosième Étape: Configurer AWS

Tout d'abord il faut ajouter la gem AWS dans son Gemfile et l'installer avec `bundle install`

```ruby
# Gemfile
gem "aws-sdk-s3", require: false
```

Pour créer un compte suivez [ce lien](https://aws.amazon.com/).

Ensuite connectez vous à la console AWS. La configuration va se faire en 3 temps.

* Créer son bucket (un espace de stockage).
* Créer un stratégie d'accès pour les futurs utilisateurs.
* Créer un utilisateur et lui associer une stratégie.


#### Créer son bucket

Vous devez cliquer sur `Services` puis recherchez `S3`. Ensuite vous cliquez sur `Créer un compartiment`. Dans le nom du compartiment vous mettez le nom de votre app. Et pour la région, il faut choisir l'Irlande si vous êtes chez Heroku (afin que les 2 serveurs soit le plus proche possible).

![](/images/posts/active-storage/02.png)

#### Créer une stratégie

Vous faites une nouvelle recherche dans `Services` et vous recherchez `IAM`. Nous allons maintenant créer une stratégie.

Pour les actions manuelles, il faut cocher `Toutes les actions S3` et sélectionnez toutes les ressources. Pour le nom il faut être le plus clair possible en explicitant le nom du bucket et quels sont les droit (ici full access, l'utilisateur peut lire et écrire). Et pour le type d'accès ca sera `programatique` c'est à dire que c'est un programme qui va y accéder et non un humain. Il n'y aura pas de mot de passe mais un token.

![](/images/posts/active-storage/10.png)
![](/images/posts/active-storage/12.png)
![](/images/posts/active-storage/13.png)

#### Créer un utilisateur

Pour les utilisateurs il faut choisir un nom d'utilisateur et ensuite un service. Ici ca sera encore une fois S3. Ensuite on va sur l'onglet `Attacher les stratégies` pour ajouter celle qu'on a crée juste avant. Pour les étapes 3 et 4 on peut mettre OK. AWS va ensuite nous donner les clés API que l'on doit mettre sur Heroku sous le nom de `S3_ACCESS_KEY_ID` et `S3_SECRET_ACCESS_KEY`.

![](/images/posts/active-storage/14.png)
![](/images/posts/active-storage/15.png)

### Quatrième Étape: Configuration sur l'app.

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
  region: "eu-west-1"
  # Si vous avez choisi un bucket à Paris
  # region: "eu-west-3"
```

Il faut spécifier à Heroku (c'est à dire sur l'environnement de production) que Active Storage doit utiliser Amazon. Pour cela nous allons modifier le fichier de config de la production.

```ruby
# config/environments/production.rb
config.active_storage.service = :amazon
```

### Cinquième étape: Afficher les images

Comme on ne sait pas combien d'images l'utilisateur va attacher à son appartement, je vais itérer sur les images et les inclure dans un caroussel Bootstrap.

```erb
<!-- app/views/flats/show.html.erb -->
<div class="flat-content">
   <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
     <div class="carousel-inner">
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

### Sixième étape: Seeder des images

```ruby
# db/seeds.rb
flat = Flat.new
flat.images.attach(io: File.open(my_first_image_path), filename: 'image_name.png', content_type: 'image/png')
flat.images.attach(io: File.open(my_second_image_path), filename: 'image_name.png', content_type: 'image/png')
```
