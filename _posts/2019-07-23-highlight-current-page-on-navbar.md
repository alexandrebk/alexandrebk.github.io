---
layout: post
title:  "Appliquer un style à l'onglet actif du menu de navigation"
description: "Dans ce tuto nous allons apprendre à mettre en surbrillance un onglet dans une barre de navigation."
difficulty: 1
status: tech
---

C'est un besoin courant en UX : marquer visuellement l'onglet d'un menu de navigation comme «actif». Lorsque l'on se trouve sur une page du site, on voudra que le lien dans le menu de navigation se mette en évidence soit par le texte plus gras soit par un effet souligné par exemple.

Nous supposons que nous sommes dans une application Ruby on Rails avec Bootstrap installé.

### La classe `navbar` de Bootstrap

Voici notre barre de navigation codée à l'aide de [Bootstrap](https://getbootstrap.com/docs/4.0/components/navbar/) avec 4 liens.

```erb
# app/views/shared/_navabar.html.erb

<div class="navbar navbar-expand-sm navbar-light">
  <ul class="navbar-nav mr-auto">
    <li class="nav-item">
      <%= link_to "Publier une annonce", new_flat_path, class: "nav-link" %>
    </li>
    <li class="nav-item">
      <%= link_to "Mes appartements", my_flat_path, class: "nav-link" %>
    </li>
    <li class="nav-item">
      <%= link_to "Mes Voyages", bookings_path, class: "nav-link" %>
    </li>
    <li class="nav-item">
      <%= link_to "Mes conversations", conversations_path, class: "nav-link" %>
    </li>
  </ul>
</div>
```

<img src="/images/posts/navbar.png" class="image" alt="navbar">

### La méthode `current_page?`

Pour mettre en surbrillance, nous allons utiliser la méthode `current_page?`. Elle prend comme argument un `path` et renvoie `true` si nous sommes bien sur ce `path`.

Dans notre exemple nous allons verifier que nous sommes bien sur `new_flat_path` avec `current_page?(new_flat_path)`. Si oui alors je veux mettre la classe `active` qui va mettre le lien en surbrillance. Sinon je ne mets rien.

Ce qui donne `'active' if current_page?(new_flat_path)`.

```erb
# app/views/shared/_navabar.html.erb

# [...]
<li class="nav-item <%= 'active' if current_page?(new_flat_path) %>">
  <%= link_to "Rechercher", new_flat_path, class: "nav-link" %>
</li>
# [...]
```

<img src="/images/posts/navbar-active.png" class="image" alt="navbar">
