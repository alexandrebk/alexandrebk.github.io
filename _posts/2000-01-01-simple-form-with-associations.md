---
layout:     post
title:      "Utilisation avancées de Simple Form"
author:     alexandre
difficulty: 1
status:     draft
---

Dans ce tuto nous allons apprendre à ajouter des reviews sur notre application de réservations d'appartement avec une liste déroulante grâce à simple form.

Nous supposons qu'il y a un model `Booking` et `User`, et qu'il y'a déjà une application Rails avec plusieurs modèles.

Les utilisateurs vont avoir la possibilité de laisser une commentaire sur une location.

### Première étape

Tout d'abord nous allons générer une migration pour créer la table `reviews`

```
class CreateReviews < ActiveRecord::Migration[5.2]
  def change
    create_table :reviews do |t|
      t.text       :content
      t.integer    :rating,  default: 0
      t.references :user,    foreign_key: true
      t.references :booking, foreign_key: true

      t.timestamps
    end
  end
end
```

### Seconde Étape:

Ensuite nous allons dans le controlleur pour passer les bonnes variables.

Un petit tricks dans Rails. Si vous créez une méhtode `name` dans le modèle, Simple_form va automatique aller la chercher pour afficher les dropdown.
```
# app/models/user.rb

def name
  "#{first_name] #{last_name}"
end
```

### Trosième Étape:

```ruby
<%= simple_form_for(@review) do |f| %>
  <%= f.input :content %>
  <%= f.input :rating %>
  <%= f.association :booking %>
<% end %>
```
