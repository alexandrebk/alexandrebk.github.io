---
layout: post
title:  "Installer un back-office avec Administrate"
description: "Dans ce tuto nous allons installer un back office avec la gem administrate."
seo_title:  "Back-office Admin"
seo_description: "Installer back office avec gem administrate"
difficulty: 3
status: tech
tags: "admin, administrate, thoughbot"
---

Tous les administrateurs de votre web-app ne sont pas forcément des développeurs. Developpé par <a href="https://thoughtbot.com/" class="underlined" target="_blank">Thoughbot</a> la *gem* <a href="https://github.com/thoughtbot/administrate" class="underlined" target="_blank">Administrate</a> permet de créer rapidement une interface d'administration. Grâce à Administrate, vos administrateurs pourront directement créer ou modifier ces modèles sans passer par la console.

Il existe deux *gems* équivalentes qui sont <a href="https://github.com/activeadmin/activeadmin" class="underlined" target="_blank">Active Admin</a> et <a href="https://github.com/sferik/rails_admin" class="underlined" target="_blank">Rails Admin</a>. Nous supposons donc qu’il y a une application Rails avec déjà plusieurs modèles.

### 1. Ajouter la gem

Il faut ajouter la Gemfile dans le `Gemfile`.

```ruby
# Gemfile

# [...]
gem 'administrate'
```

Ensuite on installe la *gem*.

```sh
$ bundle install
```

### 2. Créer les routes et les contrôleurs

```sh
$ rails generate administrate:install
$ rails server
```

Le dashboard est maintenant disponible sur <a href="localhost:3000/admin" class="underlined" target="_blank">localhost:3000/admin</a>.

<img src="/images/posts/administrate/administrate-bookings-before.png"
     class="image"
     alt="administrate">

Dans le fichier `config/routes.rb` on peut voir que les routes ont été générées automatiquement.

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

Des contrôleurs ont aussi été créé automatiquement dans `app/controllers/admin` ainsi que des modèles dans `app/dashboards`.

Vous pouvez enlevez ou ajouter des variables d'instance dans *ATTRIBUTE_TYPES*.

Pour modifier les options d'*edit* et de *new* il faut aller dans les contrôleurs (plus d'explications dans la <a href="https://administrate-prototype.herokuapp.com/customizing_controller_actions" class="underlined" target="_blank">documentation</a>)


Pour modifier ce qui est affiché dans les vues il faut aller dans le dossier app/dashboards.

Dans l'array *COLLECTION_ATTRIBUTES* vous avez les variables affichées dans l'*index*. Dans l'array *SHOW_PAGE_ATTRIBUTES*, ce qui est affiché dans la *show*.

Et dans *FORM_ATTRIBUTES*, vous avez les variables qui s'affichent dans les formulaires d'*edit* ou de *new*.


### 3. Modifier les vues

Si on va sur l'adresse <a href="localhost:3000/admin" class="underlined" target="_blank">localhost:3000/admin</a> on se rend compte que les instances de *Flat* et les *User* sont affichées avec leur *id* ce qui n'est pas très lisible.

<img src="/images/posts/administrate/administrate-bookings-before.png"
     class="image"
     alt="administrate">

On va donc ajouter une méthode dans `app/dashboards/user_dashboard.rb` pour afficher le nom des utilisateurs correctement.

```ruby
# app/dashboards/user_dashboard.rb

class UserDashboard < Administrate::BaseDashboard
  # [...]
  def display_resource(user)
    "#{user.first_name} #{user.last_name}"
  end
end
```

Et de même pour les *Flat*.

```ruby
# app/dashboards/flat_dashboard.rb

class FlatDashboard < Administrate::BaseDashboard
  # [...]
  def display_resource(flat)
    "#{flat.address}"
  end
end
```

<img src="/images/posts/administrate/administrate-bookings-after.png"
     class="image"
     alt="administrate">

### 4. Créer un dashboard additionel

Si on ajoute un nouveau modèle dans notre app, par exemple *Foo*, il faut générer les outils *administrate* avec la commande suivante.

```sh
$ rails generate administrate:dashboard Foo
```

### 5. Protéger l'accès avec un mot de passe.

Tout le monde ne doit pas avoir accès à la partie d'administration du site sous peine de pouvoir modifier toutes les données de votre site. Afin de protéger l'accès, on va ajouter une authentification http.

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

La documentation de la *gem* est disponible <a href="https://administrate-prototype.herokuapp.com/" class="underlined" target="_blank">ici</a>
