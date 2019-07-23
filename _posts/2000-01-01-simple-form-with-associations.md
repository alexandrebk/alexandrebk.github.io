---
layout: post
title:  "Les listes déroulantes avec Simple form"
author: alexandre
status: draft
---

Dans ce tuto nous allons apprendre à construire une formulaire Simple Form avec des listes déroulantes.

Nous supposons qu'il y a un model `Flat` et qu'il y'a déjà une application Rails avec plusieurs modèles.

Nous allons ajouter un formulaire pour la création d'un `flat`.

### Première étape

Tout d'abord nous allons créer les routes.

Et faire les migrations pour que le modèle acceuille toutes les données.

### Seconde Étape: 

Ensuite nous allons dans le controlleur pour passer les bonnes variables.

### Trosième Étape: 

```ruby
<%= simple_form_for(@flat) do |f| %>
  <%= f.input :name %>
  <%= f.association :race %>
<% end %>
```
