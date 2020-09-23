---
layout: post
title:  "Installer un back-office avec Administrate"
description: "Dans ce tuto nous allons installer un back office avec la gem administrate."
difficulty: 3
status: tech
tags: "admin, administrate, thoughbot"
---

Tous les administrateurs de votre web-app ne sont pas forcément des développeurs. Administrate permet de créer rapidement une interface d'administration accessible par certains utilisateurs.

Nous supposons qu’il y a déjà une application Rails avec un modèle `Flat` et un modèle `Booking`. Grâce à Administrate, vos administrateurs pourront créer ou modifier des réservations, des appartements...

### Première étape : ajouter la gem

Il faut ajouter `administrate` dans le gemfile.

```ruby
# Gemfile

# [...]
gem 'administrate'
```

Ensuite on lance l'installation

```sh
$ bundle install
```

### Seconde étape : créer les routes et les contrôleurs

```sh
$ rails generate administrate:install
```

Le dashboard est maintenant disponible sur [localhost:3000/admin](localhost:3000/admin)

<img src="/images/posts/administrate/administrate-bookings-before.png" class="image" alt="administrate">

Dans le fichier `routes.rb` on peut voir que les routes ont été générées automatiquement.

```ruby
# config/routes.rb

Rails.application.routes.draw do
  namespace :admin do
    resources :users
    resources :bookings
    resources :flats

    root to: "users#index"
  end
  # [...]
end
```

Des contrôleurs ont été créé dans `app/controllers/admin` ainsi que des modèles dans `app/dashboards`.

Vous pouvez enlevez ou ajouter des variables venant de l'array `ATTRIBUTE_TYPES`.

Pour modifier les options d'*edit* et de *new* il faut aller dans les contrôleurs (plus de détails dans la [doc](https://administrate-prototype.herokuapp.com/customizing_controller_actions)). Par exemple si vous souhaitez envoyer un email après avoir modifié un `booking`.

Pour modifier ce qui est affiché dans les vues il faut aller dans le dossier app/dashboards.

Dans l'array `COLLECTION_ATTRIBUTES` vous avez les variables affichées dans l'*index*. Dans l'array `SHOW_PAGE_ATTRIBUTES`, vous avez ce qui est affiché dans la *show*.

Et dans `FORM_ATTRIBUTES`, vous avez les variables qui s'affichent dans les formulaires d'*edit* ou de *new*.


### Troisième étape : modifier les vues

Si on va sur l'adresse [localhost:3000/admin](localhost:3000/admin) on se rend compte que les `Flat` et les `User` sont écrits avec leur `id` ce qui n'est pas très lisible.

<img src="/images/posts/administrate/administrate-bookings-before.png" class="image" alt="administrate">

On va donc ajouter une méthode dans le `user_dashboard` pour afficher le nom des utilisateurs correctement.

```ruby
# app/dashboards/user_dashboard.rb

class UserDashboard < Administrate::BaseDashboard
  # [...]
  def display_resource(user)
    "#{user.first_name} #{user.last_name}"
  end
end
```

Et de même pour les `Flat`

```ruby
# app/dashboards/flat_dashboard.rb

class FlatDashboard < Administrate::BaseDashboard
  # [...]
  def display_resource(flat)
    "#{flat.address}"
  end
end
```

<img src="/images/posts/administrate/administrate-bookings-after.png" class="image" alt="administrate">

### Quatrième étape : créer un dashboard additionel

Si on ajoute un nouveau modèle dans notre app, par exemple `Foo`, il faut générer les outils `administrate` avec la commande suivante.

```sh
$ rails generate administrate:dashboard Foo
```

### Cinquième étape : protéger l'accès par un mot de passe.

Tout le monde ne doit pas avoir accès à la partie administration sous peine de pouvoir modifier toutes les données de votre site. Afin de protéger la partie Admin de votre site, vous pouvez rajouter une authentification:

```ruby
# app/controllers/admin/application_controller.rb

module Admin
  class ApplicationController < Administrate::ApplicationController
    http_basic_authenticate_with name: ENV['ADMIN_LOGIN'], password: ENV['ADMIN_PASSWORD']
  end
end
```

Et ajouter dans votre fichier `.env` vos logins et mots de passe.

```sh
# .env

ADMIN_LOGIN="login"
ADMIN_PASSWORD="password"
```

Toute la documentation sur la gem est disponible [ici](https://administrate-prototype.herokuapp.com/)
