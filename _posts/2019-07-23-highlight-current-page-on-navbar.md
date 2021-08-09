---
layout: post
title:  "Souligner l'onglet actif du menu de navigation"
description: "Dans ce tuto nous allons apprendre à mettre en surbrillance un onglet dans une barre de navigation."
title_seo:  "Souligner onglet menu de navigation"
seo_description: "Mettre en surbrillance un onglet dans une barre de navigation."
difficulty: 1
status: tech
tags: "navbar, css, bootstrap"
---

C'est un besoin courant en UX : marquer visuellement l'onglet d'un menu de navigation comme «actif». Lorsque l'on se trouve sur une page du site, on voudra que le lien dans le menu de navigation se mette en évidence par exemple avec un texte plus gras.

Nous supposons que nous sommes dans une application Ruby on Rails avec Bootstrap d'installé.

### La classe *navbar* de Bootstrap

Voici notre barre de navigation codée à l'aide de <a href="https://getbootstrap.com/docs/4.0/components/navbar/" class="underlined"target="_blank">Bootstrap</a>.

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

<img src="/images/posts/navbar.png"
     class="image"
     alt="navbar">

### La méthode *current_page?*

Pour mettre en surbrillance, nous allons utiliser la méthode *current_page?*. Elle prend comme argument un *path* et renvoie *true* si nous sommes bien sur ce *path*.

```erb
# app/views/shared/_navabar.html.erb

<div class="navbar navbar-expand-sm navbar-light">
  <ul class="navbar-nav mr-auto">
    <li class="nav-item <%= 'active' if current_page?(new_flat_path) %>">
      <%= link_to "Publier une annonce", new_flat_path, class: "nav-link" %>
    </li>
    <li class="nav-item <%= 'active' if current_page?(my_flat_path) %>">
      <%= link_to "Mes appartements", my_flat_path, class: "nav-link" %>
    </li>
    <li class="nav-item <%= 'active' if current_page?(bookings_path) %>">
      <%= link_to "Mes Voyages", bookings_path, class: "nav-link" %>
    </li>
    <li class="nav-item <%= 'active' if current_page?(conversations_path) %>">
      <%= link_to "Mes conversations", conversations_path, class: "nav-link" %>
    </li>
  </ul>
</div>
```

<img src="/images/posts/navbar-active.png"
     class="image"
     alt="navbar">
