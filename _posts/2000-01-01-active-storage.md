---
layout: post
title:  "Ajouter des photos avec Active Storage"
author: alexandre
status: draft
---

Dans ce tuto nous allons apprendre comment ajouter plusieurs photos à un modèle avec Active Storage.

### Première étape: Installer Active Storage

Si vous n'êtes pas dans Rails 6, il vous faudra ajouter la gem Active Storage dans votre Gemfile.

Ensuite il faut l'installer avec la commande `rails active_storage:install` et créer les tables avec `rails db:migrate`.

```
rails active_storage:install
rails db:migrate
```

### Seconde Étape: Ajouter les photos au model

Ensuite nous allons attacher des photos à notre modèle `Flat` mais sans ajouter un nouvelle colonne à notre base de données. Il faut s'assurer que les images vont bien passer dans les params. Et ajouter dans la vue la possibilité dans le formulaire la possibilité d'ajouter des photos.

```ruby
class Flat < ApplicationRecord
  has_many_attached :images
end
```

```ruby
# app/controllers/flats_controller.html.erb
  def flat_params
    params.require(:flat).permit(:title, :content, images: [])
  end
```

```erb
<!-- app/views/flats/new.html.erb -->
[...]
<%= form.file_field :pictures, multiple: true, class: "form-control" %>
[...]
```

### Trosième Étape: Configurer AWS

Pour créer un compte rendez-vous sur [ce lien](https://aws.amazon.com/).

Ensuite connectez vous à la console AWS. La configuration va se faire en 3 temps.

* Créer son bucket (un espace de stockage).
* Créer un stratégie d'accès pour les futurs utilisateurs.
* Créer un utilisateur et lui associer une stratégie.


#### Créer son bucket

Vous cliquer sur `Services` et vous recherchez `S3`. Ensuite vous cliquez sur `Créer un compartiment`. Dans le nom du compartiment vous mettez le nom de votre app. Et pour la région, il faut choisir l'Irlande si vous êtes chez Heroku (afin que les 2 serveurs soit le plus proche possible).

![](/images/posts/active-storage/02.png)

#### Créer une stratégie

Vous faites une nouvelle recherche dans `Services` et vous recherchez `IAM`. Nous allons maintenant créer une stratégie.

Pour les actions manuelles, il faut cocher `Toutes les actions S3` et sélectionnez toutes les ressources. Pour le nom il faut être le plus clair possible en explicitant le nom du bucket et quels sont les droit (ici full access, l'utilisateur peut lire et écrire). Et pour le type d'accès ca sera `programatique` c'est à dire que c'est un programme et non un humain qui va y accéder. Il n'y aura pas de mot de passe mais un token.

![](/images/posts/active-storage/10.png)
![](/images/posts/active-storage/12.png)
![](/images/posts/active-storage/13.png)

#### Créer un utilisateur

Pour les utilisateurs il faut choisir un nom d'utilisateur et ensuite un service. Ici ca sera encore une fois S3. Ensuite on va sur l'onglet `Attacher les stratégies` pour ajouter celle qu'on a crée juste avant. Pour les étapes 3 et 4 on peut mettre OK. AWS va ensuite nous donner les clés API que l'on doit mettre sur Heroku sous le nom de `S3_ACCESS_KEY_ID` et `S3_SECRET_ACCESS_KEY`.

![](/images/posts/active-storage/14.png)
![](/images/posts/active-storage/15.png)

### Trosième Étape:

Ajouter votre bucket AWS

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
  access_key_id: ENV['S3_ACCESS_KEY_ID']
  secret_access_key: ENV['S3_SECRET_ACCESS_KEY']
  bucket: "airbnb-copycat"
  region: "eu-west-1" # pour Paris "eu-west-3"
```

Il faut sépcifier à l'environnement de production (c'est à dire sur Heroku) que Active Storage doit utiliser Amazon. Pour cela nous allons modifier le fichier de config pour la production.

```ruby
# config/environments/production.rb
config.active_storage.service = :amazon
```

### Quatrième étape: Intégrer au seeds

```ruby
# db/seeds.rb
```
