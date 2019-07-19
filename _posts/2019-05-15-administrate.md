---
layout: post
title:  "Installer un back-office avec Administrate"
author: alexandre
---

Dans ce tuto nous allons installer un back office avec la gem `administrate`

Nous supposons qu'il y a un model `Flat` et `Booking` qu'il y'a déjà une application Rails avec plusieurs modèles. Nous allons laisser la possibilité aux administrateurs du site de créer ou de modifier des réservations.

### Première étape

Il faut ajouter `administrate` dans le gemfile.
Ensuite on lance

```
$ bundle install
```

### Seconde Étape:

```
$ rails generate administrate:install
```

Les routes ont été générés automatiquement

```
#config/routes.rb
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

Le dashboard est maintenant disponible sur [localhost:3000/admin](localhost:3000/admin)

### Trosième Étape:

Si on va sur l'adresse [localhost:3000/admin](localhost:3000/admin) on se rend compte que les `Flat` et les `User` sont écrits avec leur `id` ce qui n'est pas très lisibles.

On va donc ajouter une méthode dans le `user_dashboard` pour afficher le nom des utilisateurs correctement.

```
# app/dashboards/user_dashboard.rb
class UserDashboard < Administrate::BaseDashboard
  [...]
  def display_resource(user)
    "#{user.first_name} #{user.last_name}"
  end
end
```

Et de même pour les `Flat`

```
# app/dashboards/user_dashboard.rb
class FlatDashboard < Administrate::BaseDashboard
  [...]
  def display_resource(flat)
    "#{flat.address}"
  end
end
```

Et on peut même modifier les options d'edit et de new dans les controller (voir la [doc](https://administrate-prototype.herokuapp.com/customizing_controller_actions)). Par exemple si vous souhaitez envoyer un email après avoir modifier un `booking`.

### Quatrième étape: Ajoutez une variable d'instance

Pour ajouter des données modifiables il faut aller dans `app/dashboards` et modifier le `dashboard` correspondant. Par exemple `booking_dashboard.rb` si on veut ajouter un attribut dans le modèle `Booking`.

### Cinquième étape: Créer un dashboard additionel

Si on ajouter un nouveau modèle, par exemple `Foo`, il faut le générer avec le modèle suivant.

```
$ rails generate administrate:dashboard Foo
```

Toute la documentation est disponible [ici](https://administrate-prototype.herokuapp.com/)
