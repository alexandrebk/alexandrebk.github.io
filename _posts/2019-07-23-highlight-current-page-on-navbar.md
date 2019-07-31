---
layout: post
title:  "Appliquer un mode ‘active’ à sa barre de navigation"
author: alexandre
difficulty: 1
---

Dans ce tuto nous allons apprendre comment mettre en surbrillance la page sur laquel se trouve l'utilisateur dans une barre de navigation. Pour cela nous allons utiliser la classe `active` de Boostrap.

Nous supposons qu'il y a une application Rails avec Bootstrap installé et une `navbar` classique avec des classes bootstrap à l'intérieur. Dans notre navbar nous avons 4 liens plus un avatar. 

![Barre de navigation](/images/posts/navbar.png)

Dans un pemier temps nous allons mettre en surbrillance l'onglet "Publier une annonce" ci-dessous:

```erb
# app/views/shared/_navabar.html.erb
# [...]
<li class="nav-item">
  <%= link_to "Publier une annonce", new_flat_path, class: "nav-link" %>
</li>
```

### La méthode current page

Pour mettre en surbrillance, nous allons utiliser la méthode `current_page?`. Elle prend comme argument une route et vérifie que nous sommes bien sur celle ci. Donc dans notre exemple nous allons verifier que nous sommes bien dans `new_flat_path` avec `current_page?(new_flat_path)`. Si oui alors je veux mettre la classe `active` si non je ne mets rien. En code cela se traduit par `'active' if current_page?(new_flat_path)`. Nous avons donc:

```erb
<li class="nav-item <%= 'active' if current_page?(new_flat_path) %>">
  <%= link_to "Rechercher", new_flat_path, class: "nav-link" %>
</li>
```

![Barre de navigation](/images/posts/navbar-active.png)

Vous pouvez retrouver un exemple de code [ici](https://github.com/alexandrebk/airbnb-copycat/commit/9eb0f044feee4acdee35640fd7dff27171fe205a)
